package com.hotplace25.exception;

import org.springframework.security.core.AuthenticationException;

public class NotAuthorizedByAdmin extends AuthenticationException{

	public NotAuthorizedByAdmin(String msg) {
		super(msg);
	}
	
	public NotAuthorizedByAdmin(String msg, Throwable t) {
		super(msg, t);
	}

}
