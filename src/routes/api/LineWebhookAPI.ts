import * as mongoose from 'mongoose';
import * as querystring from 'querystring';
import { NextFunction, Request, Response, Router } from 'express';
import * as JwtDecode from 'jwt-decode';
import * as qs from 'qs';
import Axios from 'axios';
import { MiddlewareConfig, Client, middleware, JSONParseError, SignatureValidationFailed, TemplateMessage, WebhookEvent, ClientConfig, validateSignature, TextMessage, Message } from '@line/bot-sdk';
import { error, print } from 'util';
import { createHmac } from 'crypto';

import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg, LINE_CODE } from '../ResultCode';

import { DHLog }            from '../../util/DHLog';

import { DHAPI }            from '../../const/DHAPI';
import { LINEAPI }          from '../../const/LINEAPI';

import { BaseRoute }        from './../BaseRoute';
import { BaseAPI }          from './BaseAPI';

import { DBHelper }         from '../../mongo/helper/DBHelper';
import { IChatroom }        from '../../mongo/interface/IChatroom';
import { ChatroomHelper }   from '../../mongo/helper/ChatroomHelper';
import { UserHelper }       from '../../mongo/helper/UserHelper';
import { RecordHelper }     from '../../mongo/helper/RecordHelper';
import { IRecord }          from '../../mongo/interface/IRecord';

/**
 * @description LINE 機器人相關 api
 */
export class LineWebhookAPI extends BaseAPI {
    
    protected uri = LINEAPI.API_LINEBOT_PATH;
    private recordUrl = LINEAPI.API_LINEBOT_PUSH_RECORD_PATH;
    private messageUrl = LINEAPI.API_LINEBOT_PUSH_MESSAGE_PATH;
    private authorizationUrl = LINEAPI.API_LINE_AUTH_PATH;
    private profileUrl = LINEAPI.API_LINE_PROFILE_PATH;
    private templeteUrl = LINEAPI.API_LINEBOT_PUSH_TEMPLETE_PATH;
    
    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;

    private userHelper: UserHelper;
    private chatroomHelper: ChatroomHelper;
    private recordHelper: RecordHelper;

    constructor(connection: mongoose.Connection) {
        super();
        
        this.helper = new ChatroomHelper(connection);
        this.recordHelper = new RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper(connection);
        this.userHelper = new UserHelper(connection);

        this.clientConfig = {
            channelAccessToken: DHAPI.pkgjson.linebot.channelAccessToken
        }

        this.middlewareConfig = {
            channelSecret: DHAPI.pkgjson.linebot.channelSecret
        }
    }

    public static create(router: Router) {
        let api = new LineWebhookAPI(DBHelper.connection);
        DHLog.d('[' + this.name + ':create] ' + api.uri);
        
        api.post(router);
        api.postRecord(router);
        api.posthMessage(router);
        api.postTemplete(router);
        api.getAuthorization(router);
    }

    /**
     * @description 取得 line Signature
     * @param body 
     * @param screat 
     */
    private static getSignature(body: string, screat: string): string {
        let signature = createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }

    /**
     * @description 驗證line Signature機制
     * @param req 
     */
    private isValidateSignature(req: Request): boolean{
        if (validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers['x-line-signature'].toString())) {
            return true;
        }else {
            DHLog.ld('x-line-signature = ' + req.headers['x-line-signature']);
            DHLog.ld('x-line-signature = ' + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
        }
    }

    /**
     * @description 取得 chat 類型id
     * @param source 
     */
    private getChatId(source: any): string {
        if (source && source.type) {
            switch(source.type) {
                case 'user':
                    return source.userId;
                case 'room':
                    return source.roomId;
                default:
                    return source.groupId;
            }
        }

        return null;
    }
    
    /**
     * @description 儲存 chat 相關資訊
     * @param lineUserId 
     * @param chatId 
     * @param type 
     */
    private saveChat(lineUserId: string, chatId: string, type:string) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };

        this.helper.add(source, null);
        
        let client = new Client(this.clientConfig);
        client.getProfile(source.lineUserId).then((profile) => {
            DHLog.ld('profile ' + JSON.stringify(profile));
        }).catch((err) => {
            DHLog.ld('err ' + err);
        });
    }

    /**
     * @description 內部呼叫發送機制
     * @param message 
     * @param chats 
     * @param callback 
     */
    private pushMessage(message: Message, chats: IChatroom[], callback?: () => void) {
        let client = new Client(this.clientConfig);
        if (chats.length == 0)  {
            if (callback) callback();
            return;
        }

        var chat = chats[0];
        DHLog.ld('push ' + chat.chatId);
        DHLog.ld('msg ' + JSON.stringify(message));

        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog.ld('push message success ' + JSON.stringify(value));
            chats.shift();
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog.ld('push message error ' + err);
            chats.shift();
            this.pushMessage(message, chats, callback);
        });
    }

    /**
     * @description 取得line web login 授權
     * @param router 
     */
    protected getAuthorization(router: Router) {
        router.get(this.authorizationUrl, (req, res, next) => {
            DHLog.ld('step 1 Get Authorization start');
            var error = req.query.error;
            var error_description = req.query.error_description;
            if (error) {
                DHLog.ld('error ' + error);
                DHLog.ld('error ' + error_description);
                return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_LOGIN_ERROR);
            }

            var state = req.query.state;
            var code = req.query.code;
            if (!code) {
                return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_LOGIN_ERROR);
            }

            var fullUrl = BaseRoute.getFullHostUrl(req);
            var authUrl = fullUrl + LINEAPI.API_LINE_AUTH_PATH;
            var channelId = DHAPI.pkgjson.linelogin.channelId;
            var channelSecret = DHAPI.pkgjson.linelogin.channelSecret;

            /* Get Access Token */
            var bodyFormData = qs.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: authUrl,
                client_id: channelId,
                client_secret: channelSecret
            });

            DHLog.ld('body ' + bodyFormData);
            
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            DHLog.ld('step 2 Get accesstoken start ' + JSON.stringify(config));
            Axios.post(LINEAPI.API_ACCESS_TOKEN, bodyFormData, config).then((response) => {
                DHLog.ld('response $(respons.data)');
                var json = response.data;
                if (!json.id_token) {
                    return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_LOGIN_ERROR);
                }

                let jwt = JwtDecode(json.id_token);
                var sub = jwt['sub'];
                var name = jwt['name'];
                var picture = jwt['picture'];

                if (!sub || !name || !picture) {
                    return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_LOGIN_ERROR);
                }

                DHLog.ld('step 3  callback and check user ' + sub);
                this.userHelper.find(sub, (code, result) => {
                    if (code == MONGODB_CODE.MC_SUCCESS) {
                        DHLog.ld('step 4  result ' + sub);
                        if (req.session.account) {
                            req.session.time++;
                        }else {
                            req.session.account = sub;
                            req.session.name = name;
                            req.session.picture = picture;
                            req.session.time = 1;
                        }

                        return res.redirect(DHAPI.ROOT_PATH);
                    }else {
                        return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_MOB_PROFILE_NOT_FOUND_ERROR);
                    }
                });
            }).catch((error) => {
                DHLog.ld('error ' + error);
                return res.redirect(DHAPI.ERROR_PATH + '/' + LINE_CODE.LL_LOGIN_ERROR);
            });
        });
    }

    /**
     * @description 取得line message 回呼程式 
     * @param router 
     */
    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req)) return;
            
            this.printRequestInfo(req);
            
            let event = req.body.events[0];
            if (event.type === 'message') {
                var source = event.source;
                var chatId = this.getChatId(source);
                
                this.saveChat(source.userId, chatId, source.type);
            }
            res.statusCode = 200
            res.end()
        });
    }

    /**
     * @description 發送line message 
     * @param router 
     */
    protected posthMessage(router: Router) {
        router.post(this.messageUrl, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            
            if (!req.body) {
                this.sendBodyFaild(res);
                return;
            }

            let body = req.body;
            let lineUserId = body.lineUserId;
            let msg = body.msg;
            DHLog.ld(JSON.stringify(body));

            this.chatroomHelper.find(lineUserId, (code, chats) => {
                var message: TextMessage = {
                    type: 'text',
                    text: msg
                }

                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }

    protected postTemplete(router: Router) {
        router.post(this.templeteUrl, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }

            if (!req.body) {
                this.sendBodyFaild(res);
                return;
            }

            let body = req.body;
            let lineUserId = body.lineUserId;
            let title = body.title;
            let msg = body.msg;
            let image = BaseRoute.getFullHostUrl(req) + "/images/sport.jpeg";
            DHLog.ld(JSON.stringify(body));

            this.chatroomHelper.find(lineUserId, (code, chats) => {
                var message: TemplateMessage = {
                    type: 'template',
                    altText: title,
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: image,
                        title: title,
                        text: '請選擇以下的選項',
                        actions: [
                            {
                              type: 'postback',
                              label: '是',
                              data: 'action=ok&itemid=123'
                            },
                            {
                              type: 'postback',
                              label: '否',
                              data: 'action=no&itemid=123'
                            },
                            {
                              type: 'uri',
                              label: 'View detail',
                              uri: 'http://example.com/page/123'
                            }
                        ]
                    }
                  }

                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }

    /**
     * @description 發送紀錄至line
     * @param router 
     */
    protected postRecord(router: Router) {
        router.get(this.recordUrl + '/:recordId', (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            
            if (!req.params.recordId) {
                this.sendParamsFaild(res);
                return;
            }

            let recordId = req.params.recordId;
            this.recordHelper.findOne(recordId, (code, record) => {
                if (code != MONGODB_CODE.MC_SUCCESS) {
                    this.sendFaild(res, code);
                    return;
                }

                this.chatroomHelper.find(record.lineUserId, (code, chats) => {
                    let text = BaseRoute.getFullHostUrl(req) + DHAPI.RECORD_PREVIEW_PATH + '/' + querystring.escape(record.recordId) + '/' + querystring.escape(this.hashString(record.recordId));
                    
                    var message: TextMessage = {
                        type: 'text',
                        text: text
                    }
                    
                    this.pushMessage(message, chats, () => {
                        this.sendSuccess(res, code);
                    });
                });
            });
        });
    }

    /**
     * @description 回覆訊息處理
     * @param token 回覆訊息的token
     */
    private replyMessageWithToken(token: string) {
        let client = new Client(this.clientConfig);
        client.replyMessage(token, {
            type: 'text',
            text: '你好，我是回覆機器人',
        }).catch((err) => {
            DHLog.ld('replyMessage error ' + err);
        });
    }
}