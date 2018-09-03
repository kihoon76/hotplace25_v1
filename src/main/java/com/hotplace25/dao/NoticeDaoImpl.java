package com.hotplace25.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.hotplace25.domain.Notice;
import com.hotplace25.domain.NoticePage;

@Repository("noticeDao")
public class NoticeDaoImpl implements NoticeDao {

	private final static String namespace = "mappers.mssql.noticeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public List<Notice> selectNoticeList() {
		return msSqlSession.selectList(namespace + ".selectNoticeList");
	}

	@Override
	public NoticePage selectPage(Map map) {
		return msSqlSession.selectOne(namespace + ".selectNoticePage", map);
	}

	@Override
	public String selectNoticeContent(int writeNum) {
		return msSqlSession.selectOne(namespace + ".selectNoticeContent", writeNum);
	}

}
