import {Inject, Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {WindowModel} from "../model/window.model";

@Injectable()
export class SocketService {

    private socket?: WebSocket;

    private heartBeatTimer?: any;

    private reconnectInterval: number = 5000;

    private reconnectAttempts: number = 0;

    constructor(
        @Inject(NzMessageService) private msg: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
    }

    public initWebSocket(): void {
        this.reconnectAttempts = 0;
        let websocketUrl: string;
        if (WindowModel.domain) {
            websocketUrl = (WindowModel.domain.startsWith('http:') ? 'ws:' : 'wss:') + location.host.split(":")[1] + "/";
        } else {
            websocketUrl = (location.protocol === 'http:' ? 'ws:' : 'wss:') + "//" + location.host + location.pathname;
        }
        const token = this.tokenService.get()?.token || '';
        this.socket = new WebSocket(websocketUrl + 'erupt-websocket?token=' + token);

        this.socket.onopen = () => {
            this.startHeartbeat();
        };

        this.socket.onmessage = (event) => {
            const data = <any[]>JSON.parse(event.data);
            if (data?.[0] == "js") {
                try {
                    new Function(data[1])();
                } catch (e) {
                    this.msg.warning("socket js err: " + e);
                }
            }
        };

        this.socket.onerror = (event) => {
            console.error("socket error", event);
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket连接已关闭，关闭原因：", event.code, event.reason);
            if (event.code != 1002) {
                this.reconnect();
            }
        };
    }

    private reconnect(): void {
        this.reconnectAttempts++;
        this.clearHeartbeatTimer();
        console.log("正在进行第", this.reconnectAttempts, "次 websocket 重连尝试...");
        this.closeSocket();
        this.initWebSocket();
    }

    closeSocket(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    clearHeartbeatTimer(): void {
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer);
            this.heartBeatTimer = undefined;
        }
    }

    startHeartbeat(): void {
        this.clearHeartbeatTimer();
        this.heartBeatTimer = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(["ping"]));
            } else {
                console.log("WebSocket未连接，无法发送心跳消息。");
            }
        }, 5000);
    }

    sendMessage(command: string, data: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify([command, data]));
        } else {
            console.log("WebSocket未连接，无法发送消息。", data);
        }
    }
}