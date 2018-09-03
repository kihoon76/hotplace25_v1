<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- 토지이용계획 -->
<div class="unit">
	<div class="unit_cont bgWhite">
		<table class="tableStyle borderStyle topBold left">
			<colgroup>
				<col style="width:10%;">
				<col style="width:20%;">
				<col style="width:10%;">
				<col style="width:10%;">
				<col style="width:10%;">
				<col style="width:15%;">
				<col style="width:10%;">
				<col style="width:15%;">

			</colgroup>
			<tbody>
				<tr>
					<th>토지소재지</th>
					<td>서울특별시 송파구 잠실동</td>

					<th>지번</th>
					<td>44번지</td>

					<th>지목</th>
					<td>대</td>

					<th>면적(㎡)</th>
					<td>122,682</td>
				</tr>
			</tbody>
		</table>

		<table class="tableStyle borderStyle topBold left mgT5">
			<colgroup>
				<col style="width:10%;">
				<col style="width:20%;">
				<col style="width:30%;">
				<col style="width:40%;">
			</colgroup>
			<tbody>
				<tr>
					<th rowspan="6">지역·지구등 지정 여부</th>
					<th>「국토의 계획 및 이용에 관한 법률」에 따른 지역·지구등</th>

					<td colspan="2">도시지역, 제3종일반주거지역, 아파트지구, 중심미관지구, 도로(접함)</td>
				</tr>
				<tr>
					<th rowspan="5">다른 법령 등에 따른 지역·지구 등</th>

					<td>가축분뇨의 관리 및 이용에 관한 법률</td>
					<td>가축사육제한구역</td>
				</tr>
				<tr>
					<td rowspan="2">교육환경 보호에 관한 법률</td>
					<td>교육환경보호구역</td>
				</tr>
				<tr>
					<td>상대보호구역(2016-07-21)</td>
				</tr>
				<tr>
					<td>군사기지 및 군사시설 보호법</td>
					<td>대공방어협조구역(위탁고도:77-257m)</td>
				</tr>
				<tr>
					<td>시행령 부칙 제 3조에 따른 추가기재 확인내용</td>
					<td>3m 건축선 지정구역(세부사항은 건축과에 문의)</td>
				</tr>

				<tr>
					<th colspan="2">「토지이용규제 기본법 시행령」제9조제4항 각 호에 해당되는 사항</th>
					<td colspan="2">중점경관관리구역(2016-11-24)(역사도심) [추가기재] 건축법 제2조제1항제11호나목에 따른 도로(도로일부포함)</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<!-- 도면 -->
<div class="unit">
	<div class="unit_cont bgWhite">
		<table class="tableStyle borderStyle topBold center">
			<colgroup>
				<col style="">
				<col style="">
			</colgroup>
			<thead>
				<tr>
					<th class="center">도면</th>
					<th class="center">범례</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<img src="img/map_drawing_sample.png" alt="확인도면으로 자세한 사항은 상기 지역지구등 지정여부의 내용 확인" width="419" height="326">
					</td>
					<td class="left">
						<ul class="drawingLegend">
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">도시지역</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">제1종일반주거지역</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">제2종일반주거지역</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">제3종일반주거지역</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">아파트지구</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">공원</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">학교</span>
							</li>
							<li>
								<img src="img/map_drawing_legend_sample.png" />
								<span class="text">법정동</span>
							</li>
						</ul>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>						