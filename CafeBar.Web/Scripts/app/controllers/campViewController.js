angular.module("cafebar").controller("campViewController", function ($scope, $http, $timeout, newDashboardService, $location, readingService, $document, $routeParams) {

    //------------details------------------------
    var dashboard = {};
    var dateFormat = 'YYYY-MM-DD hh:mm A';
    dashboard.offset = 0;
    dashboard.period = "sofartoday";
    dashboard.type = "overall";
    dashboard.field = "waterconsumption";
    dashboard.siteIdRouteValue = "";
    $scope.siteLattitude = 0.0;
    $scope.siteLongitude = 0.0;

    if (typeof $routeParams.siteId != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteIdRouteValue = $routeParams.siteId;
    }

    if (typeof $routeParams.siteLattitude != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteLattitude = $routeParams.siteLattitude;
    }

    if (typeof $routeParams.siteLongitude != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteLongitude = $routeParams.siteLongitude;
    }

    $('#siteId').val($routeParams.siteId);
    document.getElementById("homedashboardLink").href = "#/dashboard/" + dashboard.siteIdRouteValue + "/" + dashboard.siteLattitude + "/" + dashboard.siteLongitude;
    document.getElementById("homedashboardCampViewLink").href = "?site="+dashboard.siteIdRouteValue + "#/campView/" + dashboard.siteIdRouteValue + "/" + dashboard.siteLattitude + "/" + dashboard.siteLongitude;
    document.getElementById("analylicsLink").href = "#/analytics/" + dashboard.siteIdRouteValue;
    document.getElementById("alarmlistlink").href = "#/alarm/list/" + dashboard.siteIdRouteValue;
    document.getElementById("alarmsetuplink").href = "#/alarm/setup/" + dashboard.siteIdRouteValue;
    document.getElementById("exportlink").href = "#/export/" + dashboard.siteIdRouteValue;
    document.getElementById("alertlistlink").href = "#/alert/list/" + dashboard.siteIdRouteValue;
    document.getElementById("alertlink").href = "#/alert/" + dashboard.siteIdRouteValue;
    document.getElementById("alertSettingLink").href = "#/alertsetting/" + dashboard.siteIdRouteValue;
    document.getElementById("powerreportlink").href = "#/powerconsumption/" + dashboard.siteIdRouteValue;
    document.getElementById("waterreportlink").href = "#/waterconsumption/" + dashboard.siteIdRouteValue;
    document.getElementById("tempreportlink").href = "#/overcooledroom/" + dashboard.siteIdRouteValue;
    document.getElementById("eqipreportlink").href = "#/equipmentshistogram/" + dashboard.siteIdRouteValue;
    document.getElementById("comparisonreportlink").href = "#/compare/" + dashboard.siteIdRouteValue;
    document.getElementById("setuplink").href = "#/setup/" + dashboard.siteIdRouteValue;
    document.getElementById("objectunitmaplink").href = "#/buildingmanagement/objectunitmapping/" + dashboard.siteIdRouteValue;
    document.getElementById("onoffmappinglink").href = "#/blockmanagement/onoffmapping/" + dashboard.siteIdRouteValue;
    document.getElementById("buildinglink").href = "#/blockmanagement/buildingmapping/" + dashboard.siteIdRouteValue;

    var currentSiteId = document.getElementById("siteId");
    newDashboardService.getSite(currentSiteId.value).error(function (res) {
        console.log('some error: ');
        console.log(res);
    }).success(function(res) {
        if (res.okay) {
            $scope.currentSite = res.model;
            //console.log('Current Site: ');
            //console.log($scope.currentSite);
            document.getElementById("campViewSiteName").innerHTML = " (" + $scope.currentSite.Name + ")";
        }
    });


        
    $scope.siteList = [];

    // begin: new code for map
    $scope.view_type = 1;//$stateParams.view_type;

    $scope.map = null;
    $scope.circlelayer = [];

    $scope.GenerateMap = function () {
        $.ajax({
            url: '/api/alarm/loadmapstatus', success: function (result) {
                if (result == "offline") {
                    var _siteId = document.getElementById("siteId");

                    if (_siteId.value > 0) {

                        var element = document.getElementById("map");
                        var map;
                        var zoomParameter = 8;
                        var mapTypeIds = [];
                        for (var type in google.maps.MapTypeId) {
                        }

                        mapTypeIds.push("GoogleRoadMaps");

                        map = new google.maps.Map(element, {
                            center: new google.maps.LatLng(dashboard.siteLattitude, dashboard.siteLongitude),
                            zoom: 16,
                            mapTypeId: "GoogleRoadMaps",
                            panControl: false,
                            streetViewControl: false,
                            mapTypeControlOptions: {
                                mapTypeIds: mapTypeIds
                            }
                        });


                        map.mapTypes.set("GoogleRoadMaps", new google.maps.ImageMapType({
                            getTileUrl: function(coord, zoom) {

                                return "../images/OfflineBlock/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                            },
                            tileSize: new google.maps.Size(256, 256),
                            name: "Google Maps",
                            maxZoom: 18
                        }));

                        newDashboardService.getBlockMaps(_siteId.value).error(function(res) {
                            console.log('some error: ');
                            console.log(res);
                        }).success(function(res) {
                            if (res.okay) {
                                $scope.blockList = res.model;
                                angular.forEach($scope.blockList, function(value, key) {
                                    //console.log(value.Latitude + ':' + value.Longitude);

                                    if (value.IsAlarmed) {
                                        var markerAlertImg = '../images/map/flashingred.gif';
                                        var alertMarker = new google.maps.Marker({
                                            position: { lat: value.Latitude, lng: value.Longitude },
                                            map: map,
                                            optimized: false,
                                            icon: markerAlertImg,
                                            id: 'block_' + value.Id
                                        });
                                        var content = "<b><u>" + value.SiteName + "</u></b><p>" + value.BuildingId + "</p>";
                                        alertMarker.addListener('click', function() {
                                            buildingClick(_siteId.value, value.Id, value.Latitude, value.Longitude, true);
                                        });

                                        var infowindow = new google.maps.InfoWindow({
                                            content: content
                                        });

                                        google.maps.event.addListener(alertMarker,'mouseover', function () {
                                          infowindow.open(map, alertMarker);
                                        });

                                        alertMarker.addListener('mouseout', function() {
                                            infowindow.close();
                                        });
                                    } else {
                                        var markerOkImg = '../images/map/green-ok.png';
                                        var okMarker = new google.maps.Marker({
                                            position: { lat: value.Latitude, lng: value.Longitude },
                                            map: map,
                                            optimized: false,
                                            icon: markerOkImg,
                                            id: 'block_' + value.Id
                                        });
                                        var okContent = "<b><u>" + value.SiteName + "</u></b><p>" + value.BuildingId + "</p>";
                                        okMarker.addListener('click', function () {
                                            buildingClick(_siteId.value, value.Id, value.Latitude, value.Longitude, false);
                                        });

                                        var okinfowindow = new google.maps.InfoWindow({
                                            content: okContent
                                        });

                                        okMarker.addListener('mouseover', function () {
                                            okinfowindow.open(map, okMarker);
                                        });

                                        okMarker.addListener('mouseout', function () {
                                            okinfowindow.close();
                                        });
                                        //if (value.OfflineMapPosition != null)
                                            //$("#map").append("<img src=\"../images/map/green-ok.png\" id=\"block_" + value.Id + "\" onclick=\"buildingClick(" + _siteId.value + "," + value.Id + "," + value.Latitude + "," + value.Longitude + "," + value.IsAlarmed + ")\" class=\"red-tooltip\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"top\" title=\"<h4><u>" + value.SiteName + "</u></h4><p>" + value.BuildingId + "</p>\"  style= \"height:40px;width:40px; position:absolute;top:" + parseFloat(value.OfflineMapPosition.split(',')[0]) + "%;left:" + parseFloat(value.OfflineMapPosition.split(',')[1]) + "%;\" />");

                                    }


                                });

                            } else {
                                console.log(res.message);
                            }
                            //$('[data-toggle="tooltip"]').tooltip();
                        });
                    } else {
                        $("#map").empty();
                        $('#map').append('<img id="demoSiteImg" class="cover"src="../images/map/offlineSite_' + $routeParams.siteId + '.PNG" />');

                    }
                } else {
                    try {
                        // set up the map
                        $scope.map = new L.Map('map',
                        { center: new L.LatLng(dashboard.siteLattitude, dashboard.siteLongitude), zoom: 15 });
                        
                        $scope.gg = new L.Google('OVERLAY');

                        $scope.map.addLayer($scope.gg);
                        //$scope.map.addControl(new L.Control.Layers({ 'Google Overlay': gg, 'OSM': osm }, {}));
                        $scope.map.on('zoomend', function () {
                            var currentZoom = $scope.map.getZoom();
                            angular.forEach($scope.circlelayer, function (circle) {
                                try {
                                    circle.setRadius(150 - ((currentZoom - 15) * 45));
                                } catch (e) {
                                    // ignored
                                }
                            });
                        });
                    } catch (err) {
                        // ignored
                    }
                }
            }
        });
        
    };

    $scope.CreateCircle = function () {

        $.ajax({
            url: '/api/alarm/loadmapstatus', success: function (result) {
                if (result == "offline") {
                    var _siteId = document.getElementById("siteId");
                    if (_siteId.value > 0) {

                        //newDashboardService.getBlockMaps(_siteId.value).error(function (res) {
                        //    console.log('some error: ');
                        //    console.log(res);
                        //}).success(function (res) {
                        //    if (res.okay) {
                        //        $scope.blockList = res.model;
                        //        angular.forEach($scope.blockList, function (value, key) {
                        //            //console.log(value.Latitude + ':' + value.Longitude);
                                    
                        //            if (value.IsAlarmed) {
                        //                if (value.OfflineMapPosition != null)
                        //                    $("#map").append("<img src=\"../images/map/flashingred.gif\" id=\"block_" + value.Id + "\" onclick=\"buildingClick(" + _siteId.value + "," + value.Id + "," + value.Latitude + "," + value.Longitude + "," + value.IsAlarmed + ")\" class=\"red-tooltip\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"top\" title=\"<h4><u>"+value.SiteName+"</u></h4><p>" + value.BuildingId + "</p>\"  style= \"height:40px;width:40px; position:absolute;top:" + parseFloat(value.OfflineMapPosition.split(',')[0]) + "%;left:" + parseFloat(value.OfflineMapPosition.split(',')[1]) + "%;\" />");

                        //            }
                        //            else {
                        //                if (value.OfflineMapPosition != null)
                        //                    $("#map").append("<img src=\"../images/map/green-ok.png\" id=\"block_" + value.Id + "\" onclick=\"buildingClick(" + _siteId.value + "," + value.Id + "," + value.Latitude + "," + value.Longitude + "," + value.IsAlarmed + ")\" class=\"red-tooltip\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"top\" title=\"<h4><u>" + value.SiteName + "</u></h4><p>" + value.BuildingId + "</p>\"  style= \"height:40px;width:40px; position:absolute;top:" + parseFloat(value.OfflineMapPosition.split(',')[0]) + "%;left:" + parseFloat(value.OfflineMapPosition.split(',')[1]) + "%;\" />");

                        //            }


                        //        });

                        //    } else {
                        //        console.log(res.message);
                        //    }
                        //    $('[data-toggle="tooltip"]').tooltip();
                        //});
                    }
                } else {
                    var greenIcon = L.icon({
                        iconUrl: '../images/map/green-ok.png',
                        title: 'Hover Text',
                        iconSize: [40, 40] // size of the icon
                    });

                    var alarmIcon = L.icon({
                        iconUrl: '../images/map/flashingred.gif',
                        iconSize: [40, 40] // size of the icon
                    });
                    // this event redirect to the dashboard view with siteid
                    function onClickBlock(e) {
                        //alert(this.getLatLng()+this.Name);
                        var _siteId = document.getElementById("siteId");
                        console.log(_siteId.value);
                        console.log('building Id: ' + this.buildingId);
                        console.log('is alarmed Id: ' + this.IsAlarmed);
                        console.log("/Home/Index#/alert/list/" + this.buildingId);
                        _siteId.value = this.key;
                        console.log(_siteId.value);
                        if (this.IsAlarmed) {
                            window.location.href = "/Home/Index?site=" + dashboard.siteIdRouteValue + "#/alarm/list/" + dashboard.siteIdRouteValue + "/" + this.buildingId;
                        } else {
                            window.location.href = "/Home/Index?site=" + dashboard.siteIdRouteValue + "#/dashboard/" + dashboard.siteIdRouteValue + "/" + dashboard.siteLattitude + "/" + dashboard.siteLongitude;
                        }

                    }

                    //$scope.map.eachLayer(function (mapLayer) {
                    //    $scope.map.removeLayer(mapLayer);
                    //});
                    //$scope.gg = new L.Google('OVERLAY');

                    //$scope.map.addLayer($scope.gg);

                    var _siteId = document.getElementById("siteId");
                    newDashboardService.getBlockMaps(_siteId.value).error(function (res) {
                        console.log('some error: ');
                        console.log(res);
                    }).success(function (res) {
                        if (res.okay) {
                            $scope.blockList = res.model;
                            console.log('Block List: ');
                            console.log($scope.blockList);
                            angular.forEach($scope.blockList, function (value, key) {
                                //console.log(value.Latitude + ':' + value.Longitude);
                                var popup = L.popup()
                                    .setLatLng([value.Latitude, value.Longitude])
                                    .setContent("<b>" + value.SiteName + "<br/>" + value.BuildingId + "</b>");

                                if (value.IsAlarmed) {
                                    var _marker = L.marker([value.Latitude, value.Longitude], { icon: alarmIcon }).addTo($scope.map).bindPopup(popup, { showOnMouseOver: true }).on('click', onClickBlock).on("mouseover", function () {
                                        this.openPopup();
                                    }).on("mouseout", function () {
                                        this.closePopup();
                                    });
                                    _marker.key = _siteId.value;
                                    _marker.IsAlarmed = true;
                                    _marker.buildingId = value.Id;
                                } else {
                                    var _marker = L.marker([value.Latitude, value.Longitude], { icon: greenIcon }).addTo($scope.map).bindPopup(popup, { showOnMouseOver: true }).on('click', onClickBlock).on("mouseover", function () {
                                        this.openPopup();
                                    }).on("mouseout", function () {
                                        this.closePopup();
                                    });
                                    _marker.key = _siteId.value;
                                    _marker.IsAlarmed = false;
                                    _marker.buildingId = value.Id;
                                }


                            });

                        } else {
                            console.log(res.message);
                        }
                    });


                    //var navalGreen = L.marker([1.32400935, 104.01484681], { icon: greenIcon });
                    //var navalAlarm = L.marker([1.32400935, 104.01484681], { icon: alarmIcon });

                    //var navalGreenPopupContent = document.createElement('div');
                    //navalGreenPopupContent.innerHTML = "<div class='popup'><img src='../images/map/resolved.png' /></div>";
                    //navalGreenPopupContent.onclick = function () {
                    //    //$state.go('powerbi');
                    //};

                    //var navalGreenPopup = L.marker([1.32400935, 104.01484681], { icon: greenIcon }).bindPopup(navalGreenPopupContent);

                    //var navalAlarmPopupContent = document.createElement('div');
                    //navalAlarmPopupContent.innerHTML = "<div class='popup'><img src='../images/map/alarm.png' width='200' /></div>";
                    //navalAlarmPopupContent.onclick = function () {
                    //    //$state.go('assign');
                    //};
                    //var navalAlarmPopup = L.marker([1.32400935, 104.01484681], { icon: alarmIcon }).bindPopup(navalAlarmPopupContent);

                    //if ($scope.view_type == 1) {
                    //    navalGreen.addTo($scope.map);
                    //    $timeout(function () {
                    //        $scope.map.removeLayer(navalGreen);
                    //        navalAlarmPopup.addTo($scope.map);
                    //        //$scope.Building_Class[3] = 'critical';
                    //    }, 10000);

                    //} else if ($scope.view_type == 2) {
                    //    navalAlarm.addTo($scope.map);
                    //    $timeout(function () {
                    //        $scope.map.removeLayer(navalAlarm);
                    //        navalGreenPopup.addTo($scope.map);
                    //        //$scope.Building_Class[3] = 'healthy';
                    //    }, 10000);
                    //}
                    //else {//if null
                    //    navalGreen.addTo($scope.map);
                    //    $timeout(function () {
                    //        $scope.map.removeLayer(navalGreen);
                    //        navalAlarmPopup.addTo($scope.map);
                    //        //$scope.Building_Class[3] = 'critical';
                    //    }, 10000);
                    //}
                }
            }
        });
       
    };

    // filter dropdown by alert or status
    $scope.searchEnabled = false;
    $scope.alerttype = {};
    $scope.alert_type_list = [{ 'id': '0', 'name': 'All(10)', 'url': '/images/icon-circle-black.png' },
                              { 'id': '1', 'name': 'Minor(0)', 'url': '/images/icon-circle-yellow.png' },
                              { 'id': '2', 'name': 'Major(0)', 'url': '/images/icon-circle-orange.png' },
                              { 'id': '3', 'name': 'Critical(1)', 'url': '/images/icon-circle-red.png' },
                              { 'id': '4', 'name': 'Healthy(9)', 'url': '/images/icon-circle-green.png' }];

    $scope.alerttype.selected = $scope.alert_type_list[0];

    $scope.buildingtype = {};
    $scope.building_type_list = [{ 'id': '0', 'name': 'All', 'url': '/images/icon-square-blue.png' },
                              { 'id': '1', 'name': 'Minor(0)', 'url': '/images/icon-circle-yellow.png' },
                              { 'id': '2', 'name': 'Major(0)', 'url': '/images/icon-circle-orange.png' },
                              { 'id': '3', 'name': 'Critical(1)', 'url': '/images/icon-circle-red.png' },
                              { 'id': '4', 'name': 'Healthy(9)', 'url': '/images/icon-circle-green.png' }];

    $scope.buildingtype.selected = $scope.building_type_list[0];
    // end: new code for map
});