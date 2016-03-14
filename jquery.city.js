/*
* ===================================================================================
* jquery jcity
* author:Jason Long
* date:2015-07-27
* version:0.2
* ===================================================================================
*/
(function ($) {
    $.extend({

        //初始化配置
        initcity: function (e, p) {
            p = $.extend({
                urlOrData: null,                            // 地址或者json数据
                showHot: true,                              // 显示热门城市，默认值true
                animate: { showClass: '', hideClass: '' },  // 显示/隐藏动画效果
                separator: '-',                             // 用什么字符隔开，默认值“-”
                onChoice: false                             // 选择后执行的事件
            }, p);

            var tabname = p.showHot ? 'hotCity' : 'province',
                pageIndex = 1,
                pageCount = 12,
                startIndex = -1,
                choiceCode = '',
                provinces = [],
                citys = [],
                areas = [];

            var option = {
                gotoTab: function (tn, total) {
                    var $li_tab = $('li[tabname="' + tn + '"]');
                    if (total > 0) {
                        tabname = tn;
                        $('.city-tab li').removeClass('city-tab-active');
                        $li_tab.addClass('city-tab-active');
                    }
                },
                bindDataForTab: function (data, total, tn) {
                    option.gotoTab(tn, total);

                    if (pageIndex < 1) {
                        pageIndex = 1;
                    }

                    if (total > 0) {
                        var pageTotal = Math.ceil(total / pageCount);

                        if (pageIndex > pageTotal) {
                            pageIndex = pageTotal;
                        }

                        var cityitems = '', tbaction = '',
                            start = (pageIndex - 1) * pageCount,
                            end = pageIndex * pageCount;

                        for (var i = start; i < end; i++) {
                            if (data[i] != undefined) {
                                var dataInfo = '';
                                if (tn == 'hotCity' || tn == 'city') {
                                    tbaction = 'area';
                                    dataInfo = '{ provinceCode: \'' + data[i].provinceCode + '\', provinceName: \'' + data[i].provinceName + '\', cityCode: \'' + data[i].code + '\', cityName: \'' + data[i].name + '\' }';
                                }
                                if (tn == 'province') {
                                    tbaction = 'city';
                                    dataInfo = '{ provinceCode: \'' + data[i].code + '\', provinceName: \'' + data[i].name + '\' }';
                                }

                                if (tn == 'area') {
                                    dataInfo = '{ provinceCode: \'' + data[i].provinceCode + '\', provinceName: \'' + data[i].provinceName + '\', cityCode: \'' + data[i].cityCode + '\', cityName: \'' + data[i].cityName + '\', areaCode: \'' + data[i].code + '\', areaName:  \'' + data[i].name + '\' }';
                                }

                                cityitems += '<li class="city-item-center text-sub" title="' + data[i].name + '"><a href="javascript:;" data-info="' + dataInfo + '" data-code="' + data[i].code + '">' + data[i].name + '</a></li>';
                            }
                        }
                        $('.city-content-item').html(cityitems);

                        $('.city-item-center > a').on('click', function (event) {
                            var dataInfo = eval('(' + $(this).data("info") + ')');
                            if (dataInfo != undefined) {
                                option.getDataForTab(tbaction, $(this).data("code"));

                                if (dataInfo.provinceName != undefined && dataInfo.cityName != undefined && dataInfo.areaName != undefined) {

                                    var addressInfo = dataInfo.provinceName + p.separator + dataInfo.cityName + p.separator + dataInfo.areaName;

                                    if (p.onChoice) {
                                        p.onChoice(dataInfo);
                                    }

                                    $(e).val(addressInfo);
                                }

                            }

                            event.stopImmediatePropagation();
                        });
                    }
                },
                getDataForTab: function (tn, code) {
                    choiceCode = code;
                    var data = [];
                    switch (tn) {
                        case 'hotCity':
                            $.each(citys, function (i, o) {
                                if (o.hotCity)
                                    data.push(o);
                            });
                            break;
                        case 'province':
                            $.each(provinces, function (i, o) {
                                data.push(o);
                            });
                            break;
                        case 'city':
                            $.each(citys, function (i, o) {
                                if (o.provinceCode == code) {
                                    data.push(o);
                                }
                            });
                            break;
                        case 'area':
                            $.each(areas, function (i, o) {
                                if (o.cityCode == code) {
                                    data.push(o);
                                }
                            });
                            break;
                        default:
                            $('.city-popup').hide();
                            break;
                    }
                    option.bindDataForTab(data, data.length, tn);
                },
                initChoice: function () {
                    tabname = p.showHot ? 'hotCity' : 'province';
                    $('.city-search').hide();

                    var choicePopup = '<div class="city-popup ' + p.animate.showClass + '">';
                    choicePopup += '<div class="city-head">';
                    choicePopup += '<ul class="city-tab">';

                    if (p.showHot) {
                        choicePopup += '<li class="city-tab-active" tabname="hotCity">热门城市</li>';
                    }

                    choicePopup += '<li tabname="province">省 份</li>';
                    choicePopup += '<li tabname="city">城 市</li>';
                    choicePopup += '<li tabname="area">区（县）</li>';
                    choicePopup += '</ul>';
                    choicePopup += '</div>';
                    choicePopup += '<div class="city-content">';
                    choicePopup += '<ul class="city-contenting">';
                    choicePopup += '<li class="city-action-prev">&lt;</li>';
                    choicePopup += '<li class="city-content-center">';
                    choicePopup += '<ul class="city-content-item">';
                    choicePopup += '</ul>';
                    choicePopup += '</li>';
                    choicePopup += '<li class="city-action-next">&gt;</li>';
                    choicePopup += '</ul>';
                    choicePopup += '</div>';
                    choicePopup += '</div>';

                    $(".city-popup").remove();
                    $(e).after(choicePopup);

                    option.getDataForTab(tabname, choiceCode);

                    $('.city-tab li').on('click', function (event) {
                        tabname = $(this).attr("tabname");
                        pageIndex = 1;
                        option.getDataForTab(tabname, choiceCode);

                        event.stopImmediatePropagation();
                    });

                    $('.city-action-prev').on('click', function (event) {
                        pageIndex--;
                        option.getDataForTab(tabname, choiceCode);

                        event.stopImmediatePropagation();
                    });

                    $('.city-action-next').on('click', function (event) {
                        pageIndex++;
                        option.getDataForTab(tabname, choiceCode);

                        event.stopImmediatePropagation();
                    });

                    $('html').on("click", function (event) {
                        option.hidePopup('.city-popup', event);
                        option.hidePopup('.city-search', event);

                        event.stopImmediatePropagation();
                    });
                },

                bindTopData: function (data, keyword, keyCode) {
                    var items = '', dataInfo = '',
                        keyStyle = '<span class="text-info">' + keyword + '</span>',
                        keyRegx = new RegExp(keyword, 'gi');

                    $.each(data, function (i, obj) {
                        if (i < pageCount - 1) {

                            if (obj.cityCode == undefined) {
                                dataInfo = '{ provinceCode: \'' + obj.provinceCode + '\', provinceName: \'' + obj.provinceName + '\', cityCode: \'' + obj.code + '\', cityName: \'' + obj.name + '\' }';

                                items += '<li data-info="' + dataInfo + '" class="text-sub" nextobj="area">' + obj.provinceName + '-' + obj.name.replace(keyRegx, keyStyle) + '（' + obj.firstPY.toLowerCase().replace(keyRegx, keyStyle) + '）</li>';
                            }
                            else {
                                dataInfo = '{ provinceCode: \'' + obj.provinceCode + '\', provinceName: \'' + obj.provinceName + '\', cityCode: \'' + obj.cityCode + '\', cityName: \'' + obj.cityName + '\', areaCode: \'' + obj.code + '\', areaName:  \'' + obj.name + '\' }';

                                items += '<li data-info="' + dataInfo + '" class="text-sub" title="' + obj.name + '">' + obj.provinceName + '-' + obj.cityName.replace(keyRegx, keyStyle) + '-' + obj.name.replace(keyRegx, keyStyle) + '（' + obj.firstPY.toLowerCase().replace(keyRegx, keyStyle) + '）</li>';
                            }
                        }
                    });

                    $(".city-search-item").html(items);

                    $(".city-search-item li").on('click', function (event) {
                        var dataJson = eval('(' + $(this).data('info') + ')');
                        if (dataJson != undefined) {
                            $('.city-search').hide();
                            if ($(this).attr('nextobj') == 'area') {
                                $('.city-popup').show();
                                option.getDataForTab('area', dataJson.cityCode);
                            }
                            else {

                                if (p.onChoice) {
                                    p.onChoice(dataJson);
                                }

                                var addressInfo = dataJson.provinceName + p.separator + dataJson.cityName + p.separator + dataJson.areaName;;

                                $(e).val(addressInfo);
                            }
                        }

                        event.stopImmediatePropagation();
                    });

                    var searchCount = $(".city-search-item li").size() - 1;

                    switch (keyCode) {
                        case 13:

                            $(".city-search-item li:eq(" + startIndex + ")").click();

                            startIndex = -1;
                            break;
                        case 38:

                            startIndex = startIndex <= 0 ? searchCount : startIndex - 1;

                            $('li.city-search-checked').removeClass('city-search-checked');
                            $(".city-search-item li:eq(" + startIndex + ")").addClass('city-search-checked');

                            break;
                        case 40:
                            startIndex = startIndex >= searchCount ? 0 : startIndex + 1;

                            $('li.city-search-checked').removeClass('city-search-checked');
                            $(".city-search-item li:eq(" + startIndex + ")").addClass('city-search-checked');

                            break
                    }
                },
                getDataForSearch: function (queryKey, keyCode) {
                    queryKey = queryKey.toLowerCase();
                    var dataObj = [];
                    if (queryKey != '') {
                        $.each(citys, function (i, data) {
                            if (data.fullPY.toLowerCase().indexOf(queryKey) > -1 || data.firstPY.toLowerCase().indexOf(queryKey) > -1 || data.name.indexOf(queryKey) > -1) {
                                dataObj.push(data);
                            }
                        });

                        $.each(areas, function (i, data) {
                            if (data.fullPY.toLowerCase().indexOf(queryKey) > -1 || data.firstPY.toLowerCase().indexOf(queryKey) > -1 || data.name.indexOf(queryKey) > -1) {
                                dataObj.push(data);
                            }
                        });

                        option.bindTopData(dataObj, queryKey, keyCode);
                    }

                    if (dataObj.length < 1) {
                        $('.city-search').hide();
                    }
                },
                initSearch: function (keyCode) {
                    $('.city-popup').hide();

                    var searchPopup = '<div class="city-search">';
                    searchPopup += '<ul class="city-search-item">';
                    searchPopup += '</ul>';
                    searchPopup += '</div>';

                    $(".city-search").remove();
                    $(e).after(searchPopup);
                    $(".city-search").width($(e).outerWidth());

                    option.getDataForSearch($.trim($(e).val()), keyCode);
                },

                //加载数据
                loadData: function () {
                    if (typeof p.urlOrData == 'string') {
                        $.ajax({
                            type: 'GET',
                            url: p.urlOrData,
                            dataType: 'json',
                            success: function (data) {
                                provinces = data.provinces;
                                citys = data.citys;
                                areas = data.areas;
                            },
                            error: function (xhr, status, msg) {

                            }
                        });
                    }
                    else {
                        var data = p.urlOrData;
                        provinces = data.provinces;
                        citys = data.citys;
                        areas = data.areas;
                    }
                },

                //隐藏
                hidePopup: function (el, event) {
                    var mint, maxt, minx, maxx;
                    var isPoint = function () {
                        //console.log(event.pageX + ">=" + minx + "&&" + event.pageX + "<=" + maxx + "&&" + event.pageY + ">=" + mint + "&&" + event.pageY + "<=" + maxt)
                        return event.pageX >= minx && event.pageX <= maxx && event.pageY >= mint && event.pageY <= maxt;
                    }
                    if ($(el).is(":visible")) {
                        mint = $(el).position().top;//- $('#txt_address').outerHeight()
                        minx = $(el).position().left;
                        maxt = mint + $(el).height();
                        maxx = minx + $(el).width();
                        if (!isPoint()) {
                            $(el).addClass(p.animate.hideClass);
                        }
                    }
                }
            }

            option.loadData();

            $(e).on('click', function (event) {
                option.initChoice();

                event.stopImmediatePropagation();
            }).on('keyup', function (event) {
                option.initSearch(event.keyCode);

                event.stopImmediatePropagation();
            });
        }
    });

    $.fn.extend({
        jcity: function (p) {
            return this.each(function () {
                $.initcity(this, p);
            });
        }
    });
})(jQuery);
