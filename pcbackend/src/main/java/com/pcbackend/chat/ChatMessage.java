// src/main/java/com/pcbackend/chat/ChatMessage.java
package com.pcbackend.chat;

public class ChatMessage {
    private MessageType type;
    private String sender;   // show name or email
    private String content;  // text
    private long timestamp;  // epoch millis

    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
