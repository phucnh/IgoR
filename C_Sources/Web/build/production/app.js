/*278865feb5414d7a2511a550f1d0867af75273ba*/Ext.define("Igor.model.Feed",{extend:"Ext.data.Model",config:{fields:["firstName","lastName","headshot","title","telephone","city","state","country","latitude","longitude"]}});Ext.define("Igor.store.Feeds",{extend:"Ext.data.Store",config:{model:"Igor.model.Feed",pageSize:5,autoLoad:true,sorters:"firstName",grouper:{groupFn:function(a){return a.get("lastName")[0]}},proxy:{type:"ajax",url:"feeds.json"}}});Ext.define("Igor.view.News",{extend:"Ext.navigation.View",xtype:"news",requires:["Ext.List",],config:{autoDestroy:false,navigationBar:{items:[{xtype:"button",id:"refreshNewsButton",iconCls:"time_repeat",iconMask:true,ui:"plain",align:"right",hideAnimation:Ext.os.is.Android?false:{type:"fadeOut",duration:200},showAnimation:Ext.os.is.Android?false:{type:"fadeIn",duration:200}}]},items:[{xtype:"list",title:"News",cls:"x-feeds",disclosure:true,limit:5,disableSelection:true,plugins:[{xclass:"Ext.plugin.ListPaging"},{xclass:"Ext.plugin.PullRefresh"}],store:"Feeds",itemTpl:['<div class="feed" style="background-image:url(resources/images/headshots/{headshot});"></div>',"{firstName} {lastName}","<span>{title}</span>"].join(""),onItemDisclosure:function(a,c,b,d){d.stopEvent();Ext.Msg.alert("Test","Redirect to page "+a.get("firstName"))},listeners:{itemtap:function(c,b,d,a){var e=c.getStore().getAt(b);Ext.Msg.alert("Test","Redirect to page "+e.get("firstName"))}}}]}});Ext.define("Igor.view.Main",{extend:"Ext.tab.Panel",xtype:"mainpanel",requires:["Igor.view.News",],config:{fullscreen:true,tabBarPosition:"bottom",ui:"dark",items:[{title:"News",iconCls:"rss",cls:"news",badgeText:"3",xtype:"news"},{xtype:"nestedlist",title:"Task",iconCls:"compose",cls:"blog",displayField:"title",store:{type:"tree",fields:["title","link","author","contentSnippet","content",{name:"leaf",defaultValue:true}],root:{leaf:false},proxy:{type:"jsonp",url:"https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog",reader:{type:"json",rootProperty:"responseData.feed.entries"}}},detailCard:{xtype:"panel",scrollable:true,styleHtmlContent:true},listeners:{itemtap:function(e,d,a,c,b){this.getDetailCard().setHtml(b.get("content"))}}},{xtype:"formpanel",title:"Me",iconCls:"team",layout:"vbox",items:[{xtype:"fieldset",title:"Contact Us",instructions:"Email address is optional",items:[{xtype:"textfield",label:"Name",name:"name"},{xtype:"emailfield",label:"Email",name:"email"},{xtype:"textareafield",label:"Message",name:"message",height:90}]},{xtype:"button",text:"Send",ui:"confirm",}]}]}});Ext.application({name:"Igor",requires:["Ext.MessageBox"],controllers:[],views:["Main"],stores:["Feeds"],models:["Feed"],icon:{57:"resources/icons/icon.png",72:"resources/icons/icon@72.png",114:"resources/icons/icon@2x.png",144:"resources/icons/icon@114.png"},phoneStartupScreen:"resources/loading/Homescreen.jpg",tabletStartupScreen:"resources/loading/Homescreen~ipad.jpg",launch:function(){Ext.fly("appLoadingIndicator").destroy();Ext.Viewport.add({xclass:"Igor.view.Main"})},onUpdated:function(){Ext.Msg.confirm("Application Update","This application has just successfully been updated to the latest version. Reload now?",function(a){if(a==="yes"){window.location.reload()}})}});