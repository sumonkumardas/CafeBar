var commonDateFormat = 'YYYY-MM-DD hh:mm A';
var commonDateOnlyFormat = 'DD/MM/YYYY';
var powerComsumptionUnit='kw';
var waterConsumptionUnit='m3';

angular
    .module("cafebar", ["ngRoute"])
    .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
        $routeProvider
           .when("/newdashboard", {
               controller: "newDashboardController",
               templateUrl: "/templates/newDashboard.html"
           })
           
          .otherwise("/newdashboard");
    }])
    .factory("PopupService", function () {
        var modal = angular.element(".modal").modal();
        if (modal) {
            modal = angular.element(angular.element("modaltemplate").html()).modal();
        }
        return {
            modal: modal
        }
    })
    .run(["$rootScope", "$templateCache", function ($rootScope, $templateCache) {
        $rootScope.$on("$routeChangeStart", function (routeChangeEvent, nextRoute, currentRoute) {
            var permissions = permission.split(",");
            if (permissions.indexOf("Administrator") < 0) {
                switch (nextRoute.controller) {
                    case "adminController":
                        if (permissions.indexOf("AdminPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "Setup":
                        if (permissions.indexOf("ObjectDataFiledSetupRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "objectUnitMappingController":
                        if (permissions.indexOf("ObjectUnitMappingRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "AlarmSetup":
                        if (permissions.indexOf("SettingsPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "AlarmList":
                        if (permissions.indexOf("ListViewPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "Widget":
                        if (permissions.indexOf("MyDashboardRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "analyticsController":
                        if (permissions.indexOf("AnalyticsRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    default:
                        break;
                }
            }
        });


    }]);

function siteClick(id,lat,lng) {
    var _siteId = document.getElementById("siteId");
    _siteId.value = id;
    window.location.href = "/Home/Index?site="+_siteId.value+"#/campView/" + _siteId.value + "/" + lat + "/" + lng;

}


function zoom() {
    $("#offLineMapImg").attr("src", "../images/map/offlinemap_zoom1.PNG");
    $('#site_3').css({ top: '72.8%', left: '21%' });
    $('#site_11').css({ top: '60%', left: '23%' });
    $('#site_7').css({ top: '60%', left: '26%' });
    $('#site_1').css({ top: '72.8%', left: '21%' });
    $('#site_2').css({ top: '72.8%', left: '21%' });
    $('#site_4').css({ top: '72.8%', left: '21%' });
    $('#site_5').css({ top: '72.8%', left: '21%' });
    $('#site_6').css({ top: '72.8%', left: '21%' });
    $('#site_8').css({ top: '72.8%', left: '21%' });
    $('#site_9').css({ top: '72.8%', left: '21%' });
    $('#site_10').css({ top: '72.8%', left: '21%' });
    $('#site_12').css({ top: '72.8%', left: '21%' });
    $('#site_13').css({ top: '72.8%', left: '21%' });
    $('#site_14').css({ top: '72.8%', left: '21%' });
    $('#site_15').css({ top: '72.8%', left: '21%' });
    $('#site_16').css({ top: '72.8%', left: '21%' });

}

function buildingClick(siteid, id, lat, lng, isAlarmed) {
    if (isAlarmed) {
        window.location.href = "/Home/Indexsite="+siteId+"#/alarm/list/" + siteid + "/" + id;
    } else {
        window.location.href = "/Home/Index?site=" + siteid + "#/dashboard/" + siteid + "/" + lat + "/" + lng;
    }

}

$.ajax({
    url: '/api/alarm/loaddateformat', success: function (result) {
        if (result) {
            commonDateFormat = result;
        }
    }
});
$.ajax({
    url: '/api/reading/OverallPowerConsumption/' + $('#siteId').val(), success: function (result) {
        if (result) {
            powerComsumptionUnit = result;
        }
    }
});
$.ajax({
    url: '/api/reading/OverallWaterConsumption/' + $('#siteId').val(), success: function (result) {
        if (result) {
            waterConsumptionUnit = result;
        }
    }
});


