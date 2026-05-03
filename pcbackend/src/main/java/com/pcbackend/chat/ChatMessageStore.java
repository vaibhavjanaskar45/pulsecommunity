package com.pcbackend.chat;



import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.LinkedBlockingDeque;

@Component
public class ChatMessageStore {
 private static final int MAX = 200; // keep only last 200 messages
 private final LinkedBlockingDeque<ChatMessage> buffer = new LinkedBlockingDeque<>(MAX);

 public synchronized void add(ChatMessage msg) {
     // trim if full
     while (buffer.remainingCapacity() == 0) buffer.pollFirst();
     buffer.offerLast(msg);
 }

 public synchronized List<ChatMessage> recent() {
     return new ArrayList<>(buffer);
 }

 public synchronized void clear() {
     buffer.clear();
 }
}
