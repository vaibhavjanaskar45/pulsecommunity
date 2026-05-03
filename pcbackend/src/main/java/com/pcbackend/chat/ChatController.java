package com.pcbackend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageStore store;

    /**
     * STOMP: client publishes to /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void send(@Payload ChatMessage incoming) {
        if (incoming == null) return;

        ChatMessage msg = new ChatMessage();
        msg.setType(incoming.getType() == null ? MessageType.CHAT : incoming.getType());
        msg.setSender(incoming.getSender());
        msg.setContent(incoming.getContent());
        msg.setTimestamp(System.currentTimeMillis());

        store.add(msg);
        // Broadcast to all subscribers of /topic/public
        messagingTemplate.convertAndSend("/topic/public", msg);
    }

    /**
     * STOMP: client publishes to /app/chat.join
     */
    @MessageMapping("/chat.join")
    public void join(@Payload ChatMessage joinReq) {
        ChatMessage msg = new ChatMessage();
        msg.setType(MessageType.JOIN);
        msg.setSender(joinReq.getSender());
        msg.setContent("joined the chat");
        msg.setTimestamp(System.currentTimeMillis());

        store.add(msg);
        messagingTemplate.convertAndSend("/topic/public", msg);
    }

    /**
     * REST: fetch recent chat messages
     */
    @GetMapping("/api/chat/recent")
    public List<ChatMessage> recent() {
        return store.recent();
    }

    /**
     * REST: clear all chat history
     */
    @DeleteMapping("/api/chat")
    public void clear() {
        store.clear();
    }
}
