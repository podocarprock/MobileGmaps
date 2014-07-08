function showPos(){
	//	// geolocationに対応しているか？
	//	If (navigator.geolocation == undefined) {
	//		alert("位置情報に対応していません");return;
	//	}
		//位置情報取得
		navigator.geolocation.getCurrentPosition(
			successCallback,
			errorCallback);
		//成功
		function successCallback(position){
	//		document.write("成功")
	//		for (var prop in position.coords) {
	//			document.write(prop + ":" + position.coords[prop] + "<br/>\n");
	//		}
			document.location = 'map.html?lon=' + position.coords.longitude +  '&lat=' + position.coords.latitude ;
		}
		function errorCallback(err) {
			alear("失敗");
		}
};


var map = null;
var marker;
var okikae;
var gmarkers =new Array();
var shoplisthtml = '';

$(document).on('pageshow','#pgSpotMap', drawMap );

function drawMap(){
  if (map == null){
    onLoad(); // 地図の初期化
  }
}
function onLoad() {

	var intLon = document.getElementById("mapX").value;
	var intLat = document.getElementById("mapY").value;

	var latlng = new google.maps.LatLng(intLat, intLon);
//	var latlng = new google.maps.LatLng(35.709984, 139.810703);

	var myOptions = {
		zoom: 13,
		center: latlng,
		featureType: "all",
		elementType: "all",
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false
	};

		var map = new google.maps.Map(document.getElementById("map"), myOptions);
		var stylez = [{featureType: "all",elementType: "all",}];
		var mapStyleType =  new google.maps.StyledMapType( stylez, {map:map, name:""});
		map.mapTypes.set('detail', mapStyleType);
		map.setMapTypeId('detail');

	google.maps.event.addListener( map , "center_changed" , function(){
		LatLngObj = map.getCenter();
		document.getElementById("mapX").value = LatLngObj.lng();
		document.getElementById("mapY").value = LatLngObj.lat();
	});

		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title:'Center'
		});

		// 半径と塗りつぶす色の配列  
		var radii = new google.maps.MVCArray([["#ff0000", 3000]]);

		// 円のオプション（固定）
		var circleOptions = {  
			center: latlng,			// 中心点(google.maps.LatLng)
			radius: null,			// 半径（ｍ）
			strokeWeight: 1,		// 外周太さ（ピクセル）
			strokeColor: "#000055",	// 外周色
			strokeOpacity: 0.8,		// 外周透過度（0: 透明 ⇔ 1:不透明）
			fillColor: null,		// 塗りつぶし色
			fillOpacity: 0			// 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
		};

		// 円を設定
		radii.forEach(function(radius, index)  
		{  
			circleOptions.fillColor = radius[0]  
			circleOptions.radius = radius[1];  
			var circle = new google.maps.Circle(circleOptions);  
			circle.setMap(map);  
		});

//		//競合リストからマーカーを作成
//		for (var i = 0; i < cvslist.length; i++) {
//			var shopdata = cvslist[i];
//			shoplisthtml += shopdata[3];
//			setMarkers(map, shopdata);
//		};
	}

function setMarkers(map, locations)
{
	var image = new google.maps.MarkerImage('/markers/numbered_marker.php?image=pushpins/webhues/' + locations[2]);
	var myLatLng = new google.maps.LatLng(locations[1], locations[0]);
	var marker = new google.maps.Marker({
		position: myLatLng,
		icon: image,
		map: map
	});
	gmarkers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
	//map.setCenter(myLatLng);
		map.panTo(myLatLng);
		infoWindow.close();
		infoWindow.setContent('<div>' + locations[3] + '</div>');
		infoWindow.open(map,marker); 
	});
}

	var infoWindow = new google.maps.InfoWindow();

// This function picks up the click and opens the corresponding info window
function myclick(i) {
	google.maps.event.trigger(gmarkers[i],"click");
}

function getMapXY(){
	LatLngObj = map.getCenter();
	document.getElementById("mapX").value = LatLngObj.x;
	document.getElementById("mapY").value = LatLngObj.y;
}

//Google Analytics
//set
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17483546-3']);

//async
(function () {
  var ga = document.createElement('script'); ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//exe
$('[data-role="page"]').live('pageshow', function(){
  var u = location.hash.replace('#', '');
  u ? _gaq.push(['_trackPageview', u]) : _gaq.push(['_trackPageview']);
});
