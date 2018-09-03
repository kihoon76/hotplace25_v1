package com.hotplace25.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.hotplace25.dao.NoticeDao;
import com.hotplace25.domain.Notice;
import com.hotplace25.domain.NoticePage;
import com.hotplace25.util.DataUtil;


@Service("noticeService")
public class NoticeService {
	
	@Resource(name="noticeDao")
	NoticeDao noticeDao;
	
	public String getPage(Map map) {
		// TODO Auto-generated method stub
		NoticePage noticePage = noticeDao.selectPage(map);
		ObjectMapper om = new ObjectMapper();
		String data = "";
		boolean result = true;
		
		try {
			data = om.writeValueAsString(noticePage);
		} 
		catch (JsonGenerationException e) {
			result = false;
		} 
		catch (JsonMappingException e) {
			result = false;
		}
		catch (IOException e) {
			result = false;
		}
		
		return DataUtil.makeReturn(data, result);
	}

	public List<Notice> getNoticeList() {
		List<Notice> list = noticeDao.selectNoticeList();
		
		return list;
	}

	public String getNoticeContent(int writeNum) {
		String content =  noticeDao.selectNoticeContent(writeNum);
		content = content.replaceAll("\n", "").replaceAll("\r", "");
		return DataUtil.makeReturn("{\"content\":\"" + content + "\"}", true);
	}
}
