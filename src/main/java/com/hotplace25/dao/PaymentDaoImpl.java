package com.hotplace25.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.hotplace25.domain.Coupon;
import com.hotplace25.domain.Payment;

@Repository("paymentDao")
public class PaymentDaoImpl implements PaymentDao {

	private static final String namespace = "mappers.mssql.paymentMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public void insertHotplaceServices(Payment payment) {
		// TODO Auto-generated method stub
		msSqlSession.insert(namespace + ".insertHotplaceServices", payment);
	}

	@Override
	public Coupon selectCoupon(String coupon) {
		return msSqlSession.selectOne(namespace + ".selectCoupon", coupon);
	}

	@Override
	public void insertPayment(Payment payment) {
		msSqlSession.insert(namespace + ".insertPayment", payment);
	}

	@Override
	public void updateCoupon(String couponNum) {
		msSqlSession.update(namespace + ".updateCoupon", couponNum);
	}

	@Override
	public List<Payment> selectPaymentList(String accountId) {
		return msSqlSession.selectList(namespace + ".selectPaymentList", accountId);
	}

	@Override
	public List<String> selectCheckPaymentList(String accountId) {
		return msSqlSession.selectList(namespace + ".selectCheckPaymentList", accountId);
	}

	@Override
	public void insertCardPaymentLog(Map<String, String> m) {
		msSqlSession.insert(namespace + ".insertCardPaymentLog", m);
		
	}

	//카드결제 자동승인
	@Override
	public void updatePayment(Map<String, String> map) {
		msSqlSession.update(namespace + ".updatePayment", map);
	}

	@Override
	public void insertCardPaymentError(Map<String, String> errLog) {
		msSqlSession.insert(namespace + ".insertCardPaymentError", errLog);
	}

}
