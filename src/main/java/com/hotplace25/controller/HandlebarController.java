package com.hotplace25.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;
import com.hotplace25.domain.Account;
import com.hotplace25.domain.GwansimMulgeon;
import com.hotplace25.domain.Payment;
import com.hotplace25.service.HotplaceService;
import com.hotplace25.service.PaymentService;
import com.hotplace25.service.SpotService;
import com.hotplace25.service.UserService;
import com.hotplace25.util.SessionUtil;


@RequestMapping("/handlebar")
@Controller
public class HandlebarController {

	@Resource(name="hotplaceService")
	HotplaceService hotplaceService;
	
	@Resource(name="spotService")
	SpotService spotService;
	
	@Resource(name="userService")
	private UserService userService;
	
	@Resource(name="paymentService")
	private PaymentService paymentService;
	
	@GetMapping("join")
	public String getJoinTos(ModelMap m) {
		
		m.addAttribute("yaggwan", hotplaceService.getYaggwanList());
		
		return "joinForm";
	}
	
	@GetMapping("payment")
	public String getPayment(HttpServletRequest request, ModelMap m) throws Exception {
		m.addAttribute("yaggwan", hotplaceService.getYaggwanList());
		
		return "paymentForm";
	}
	
	@GetMapping("tab/tojiuselimit/{tabName}")
	public String getTojiUseLimitTabHtml(@PathVariable("tabName") String tabName) {
		
		String jspName = "";
		
		switch(tabName) {
		case "default":
			jspName = "spotTojiUseLimitTab1Form";
			break;
		case "tojidaejang":
			jspName = "spotTojiUseLimitTab2Form";
			break;
		case "geonchugdaejang":
			jspName = "spotTojiUseLimitTab3Form";
			break;
		case "tojiuseplan":
			jspName = "spotTojiUseLimitTab4Form";
			break;
		case "privategongsi":
			jspName = "spotTojiUseLimitTab5Form";
			break;
		}
		
		
		return "tabs/" + jspName;
	}
	
	@GetMapping("mypage")
	public String getMypage(ModelMap m) {
		String accountId = SessionUtil.getSessionUserId();
		
		Account account = userService.getUserInfo(accountId);
		List<Payment> paymentHistory = paymentService.getPaymentHistories(accountId); 
		
		String[] email = account.getEmail().split("@");
		String[] phone = account.getPhone().split("-");
		account.setEmail1(email[0]);
		account.setEmail2(email[1]);
		account.setPhone1(phone[0]);
		account.setPhone2(phone[1]);
		account.setPhone3(phone[2]);
		
		
//		List<GwansimMulgeon> r = spotService.getMyGwansimList(accountId);
//		m.addAttribute("gwansim", r);
//		m.addAttribute("gwansimStr", new Gson().toJson(r));
		m.addAttribute("account", account);
		m.addAttribute("paymentHistory", paymentHistory);
		m.addAttribute("authorities", account.getAuthorities());
		m.addAttribute("currentDate", hotplaceService.getCurrentDate());
		
		return "mypage/mypageForm2";
	}
	
	@GetMapping("myGwansimMenu")
	public String getMyGwansimMenu(ModelMap m) {
		String accountId = SessionUtil.getSessionUserId();
		
		List<GwansimMulgeon> r = spotService.getMyGwansimList(accountId);
		m.addAttribute("gwansimStr", new Gson().toJson(r));
		return "menu/myGwansimMenu";
	}
}
