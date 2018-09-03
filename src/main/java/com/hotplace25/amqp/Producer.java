package com.hotplace25.amqp;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//@Component
public class Producer {

	@Autowired
	private RabbitTemplate rabbitTemplate;
	
	public void sendMessage(Object message) {
		rabbitTemplate.convertAndSend(message);
	}
}
