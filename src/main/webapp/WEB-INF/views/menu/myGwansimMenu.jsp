<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<div class="headArea">
	<h2>관심물건</h2>
	<button type="button" class="close">
		<i class="ambicon-015_mark_times"></i><span class="hidden">닫기</span>
	</button>
</div>
<div class="bodyArea" style="padding: 0px 10px 0px 10px;">
	<div id="dvMypageGwansimMulgeon"  class="tableStyle gridStyle center" data-tab='${gwansimStr}'></div>
</div>
<div class="footArea">
	<button type="button" class="btnstyle middle gray MENU_CLOSE" data-menu="{{menuName}}">닫기</button>
</div>
