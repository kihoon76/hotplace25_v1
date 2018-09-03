package com.hotplace25.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.hotplace25.util.HttpHeaderUtil;

public class ApplicationConfigInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		String ip = HttpHeaderUtil.getClientIP(request);
		
		if(!ip.startsWith("192.168.")) {
			response.sendRedirect("/errors/403");
			return false;
		}
		
		return true;
	}

}
