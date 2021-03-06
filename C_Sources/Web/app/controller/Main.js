Ext.define("Igor.controller.Main", {
    extend: 'Ext.app.Controller',

    requires: [
         'Igor.view.task.NewProject',
         'Igor.view.task.NewClassTask',
         'Igor.view.task.ClassDetails',
         'Igor.view.task.New',
         'Igor.view.task.AddClass',
         'Igor.utility.ux.PathMenu',
         'Igor.utility.ux.AccordionList',
         'Igor.view.task.SubjectDetails',
    ],
    
    init: function() {
        
    },

    config: {
        control: {
            updatesList: {
                itemtap: 'viewUpdateDetails',
                disclose: 'viewUpdateDetails'
            },

            tasksListByDay: {
                itemtap: 'viewTaskDetails',
            },

            userDetailsForm: {
                pop: 'onProfilePop',
            },

            daySelBtn: {
                toggle: 'onDayToggle',
            },

            tasksForm: {
                pop: 'onTaskPop',
                push: 'onTaskPush',
                initialize: 'onTaskInit'
            },

            classDetailsForm: {
                initialize: 'classDetailInit'
            },

            refreshNewsButton: {
                tap: 'onNotificationInit'
            },

            updatesListForm: {
                initialize: 'onNewsInit',
            },

            schedulerList: {
                itemtap: 'onTaskTap',
                itemtaphold: 'onTaskTapHold'
            },

            subjectSearch: {
                clearicontap: 'onSearchClearIconTap',
                keyup: 'onSearchKeyUp'
            },

            newProjectForm: {
                initialize: 'onNewProjectInit'
            },

            mainPnl: {
                initialize: 'onNotificationInit'
            },

            pathBtn: {
                itemtap: 'onPathMenuItemTap'
            },

            saveUpdatedProfileBtn: {
                tap: 'doSaveUpdatedProfile'
            },

            subjectList: {
                itemtap: 'onSubjectTapHold'
            },

            saveClassTaskBtn: {
                tap: 'doSaveNewClassTask'
            },

            saveProjectBtn: {
                tap: 'doSaveNewProject'
            },

            classTaskList: {
                itemtap: 'doClassTaskTap'
            },

            markCompletedBtn: {
                tap: 'doSetCompletedMark'
            },

            deleteJobBtn: {
                tap: 'doDeleteJob'
            }
        },
        routes: {
            // Khi xuat hien url dang http://abc.com/afterLogin/.../#updates thi se thuc hien ham doUpdates()
            'updates': 'doUpdates',
            'updates/Update/:id':'viewUpdateDetails', // Hàm này sẽ thực thi khi có route tương ứng việc click 1 item trên list update
            
            // Khi xuất hiện url dạng http://abc.com/afterLogin/.../#tasks/abc thì sẽ thực hiện hàm doTasks()
            'tasks/:id': 'doTasks',
            'tasks/taskbyday/:day_of_week': 'showTasksByDay',
            'tasks/:id':'viewTaskDetails', // Hàm này sẽ thực thi khi có route tương ứng việc click 1 item trên list task

            // Khi xuất hiện url dạng http://abc.com/afterLogin/.../#tasks thì sẽ thực hiện hàm doTasks()
            'user/:id': 'viewUserDetails',
            'user/frienddetails/:id':'viewFriendDetails',
            'user/classdetails/:id':'viewClassDetails',

            'classJobTaskDetails/:id': 'viewJobTaskDetails'
        },

        refs: {
            pathBtn: 'button[pathButtonType=menuitem]',
            newsPathItemBtn: 'button[pathButtonType=menu]',
            // Updates
            refreshNewsButton: 'updatesListForm #refreshNewsButton',
            updatesListForm: 'updatesListForm',
            daySelBtn: 'tasksForm #daySelectBtn',
            mainPnl: 'mainpanel',

            // Add New Project
            newProjectForm: 'newProjectForm',
            updatesList: 'updatesListForm #updateList',
            saveProjectBtn: 'newProjectForm #saveProjectBtn',

            //Class
            classDetails: 'classDetailsForm',
            schedulerList: 'tasksForm #schedulerList',
            userListField: 'newProjectForm #userListField',
            classTaskList: 'classDetailsForm #classTaskList',

            // New Task
            newSchedulerForm: 'newTask',
            subjectSearch: 'newTask #subjectSearch',
            subjectList: 'newTask #subjectList',

            // Add class form
            //newClassForm: 'addclassForm',

            // Tasks
            tasksForm:'tasksForm',
            addTaskBtn: '.tasksForm #addTaskBtn',
            tasksListByDay:'#tasksListByDay',
            termSelBtn: '.tasksForm #termSelectBtn',

            // Users
            userDetailsForm: 'userDetailsForm',
            editProfileButton: 'userDetailsForm #editProfileButton',
            profileEditForm: 'profileEdit',
            saveUpdatedProfileBtn: 'profileEdit #saveUpdatedProfileBtn',

            // Add Class Task
            newClassTaskForm: 'newClassTaskForm',
            saveClassTaskBtn: 'newClassTaskForm #saveClassTaskBtn',

            // Job Details Form
            jobDetailsForm: 'jobDetailsForm',
            markCompletedBtn: 'jobDetailsForm #markCompletedBtn',
            deleteJobBtn: 'jobDetailsForm #deleteJobBtn'
        },

        before: {
            // Tasks
            doTasks: ['getCurrentTime', 'getAllTasksByUser'],
        },
    },

    testFunc: function() {
        var a = this.getMainPnl().getTabBar().getComponent(0);
    },

    onPathMenuItemTap: function(menu, menuitem) {
        //console.log(menuitem);
        this.getMainPnl().setActiveItem(menuitem.getItemId() - 1);
    },

    onSearchKeyUp: function(field) {
        var value = field.getValue(),
            store = this.getSubjectList().getStore();

        store.clearFilter();

        if (value) {
            var searches = value.split(' '),
                regexps = [],
                i;

            for (i = 0; i < searches.length; i++) {
                if (!searches[i]) continue;

                regexps.push(new RegExp(searches[i], 'i'));
            }

            store.filter(function(record) {
                var matched = [];

                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i],
                        didMatch = record.get('subject_name').match(search) || record.get('subject_code').match(search);

                    matched.push(didMatch);
                }

                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    return matched[0];
                }
            });
        }
    },

    onSearchClearIconTap: function() {
        //call the clearFilter method on the store instance
        this.getSubjectList().getStore().clearFilter();
    },

    onNewsInit: function() {
        Ext.create('Igor.utility.ux.PathMenu',{
            bottom: 10,
            left: window.innerWidth / 2 - 15,
            items: [
                {
                    iconCls: 'chat_black2',
                    cardIndex: 0,
                    itemId: 5
                },
                {
                    iconCls: 'info',
                    cardIndex: 1,
                    itemId: 4
                },
                {
                    iconCls: 'team',
                    cardIndex: 2,
                    itemId: 3
                },
                {
                    iconCls: 'calendar2',
                    cardIndex: 3,
                    itemId: 2
                },
                {
                    iconCls: 'rss',
                    cardIndex: 4,
                    itemId: 1
                }
            ]
        });
    },

    classDetailInit: function() {

    },

    onTaskTap: function(list, index, target, record) {
        //var rec = list.getStore().getAt(index);
        //console.log(rec.data);
        //Ext.Msg.alert('Test', 'Redirect to class_code ' + rec.get('class_code'));
        //Ext.Viewport.setActiveItem(Ext.create('Igor.view.task.ClassDetails'));
        var termBtn = Ext.ComponentQuery.query('#termSelectBtn')[0];
        window.location.href = 'index.html#tasks/' + record.get('class_id');
        termBtn.hide();
    },

    onTaskTapHold: function(list, index, target, record) {
        //var rec = list.getStore().getAt(index);
        mainPnl = this.getMainPnl();
        var userId = Ext.getStore('Users').getAt(0).get('userid');
        Ext.Msg.confirm(
            "Delete",
            "Are you sure you want to delete this scheduler ?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    mainPnl.setMasked({
                        xtype: 'loadmask',
                        message: 'Loading...'
                    });

                    Ext.data.JsonP.request({
                        url: 'http://igor-assistant-ca-2012.appspot.com/igor/class_subject/call/jsonp/delete_class',
                        params: {
                            user_id: userId,
                            class_id: record.get('class_id')
                        },
                        disableCaching: false,

                        success: function(result, request) {
                            // Unmask the viewport
                            mainPanel = Ext.ComponentQuery.query('mainpanel')[0];
                            mainPanel.unmask();

                            if (result.status = 'OK') {
                                
                            }
                        }
                    });

                    console.log(record);
                }
            }
        );
    },

    onTaskInit: function() {
        var segmentedButton = this.getDaySelBtn();
        var date = new Date().getDay();

        if (date == 0) {
            segmentedButton.setPressedButtons(6);
            this.showTasksByDay(6);    
        } 
        else {
            segmentedButton.setPressedButtons(date - 1);
            this.showTasksByDay(date - 1); 
            /*var press = segmentedButton.getPressedButtons()[0];
            press.replaceCls('x-phapphui-in', 'x-phapphui-out');
            //press.setWidth(window.innerWidth);
            style = {
                'width': window.innerWidth + 'px',
                '-webkit-transition': 'width 1s',
                '-webkit-transition-delay': '100ms'
            };
            press.setCentered(true);
            if (!press.rendered) {
                press.setStyle(style);
            }
            else {
                press.element.applyStyles(style);
            }*/
        }

        this.getTermSelBtn().setHandler(function() {
            if (!this.picker) {
                this.picker = Ext.Viewport.add({
                    xtype: 'picker',
                    title: 'Select Term',
                    toolbar: {
                        title: 'Select Term'
                    },
                    slots: [
                        {
                            name : 'term',
                            title: 'Term',
                            data : [
                                {text: '20111', value: 20111},
                                {text: '20112', value: 20112},
                                {text: '20113', value: 20113},
                                {text: '20121', value: 20121},
                                {text: '20123', value: 20123}
                            ]
                        }
                    ]
                });
            }
            this.picker.show();
        });     
    },

    onNotificationInit: function() {
        //this.onNewsInit();

        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        //this.getMainPnl().getTabBar().getComponent(0).setBadgeText(null);
        var a = this.getNewsPathItemBtn().menuItems;

        var userId = Ext.getStore('Users').getAt(0).get('userid');
        

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/notification/call/jsonp/get_all_notification',
            params: {
                owner: userId,
            },
            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                mainPanel = Ext.ComponentQuery.query('mainpanel')[0];
                mainPanel.unmask();

                if (result.status = 'OK') {
                    var notifyStore = Ext.getStore('Notifications'),
                        notifyModel = {}, read_count = 0;

                        notifyStore.removeAll();

                    Ext.Array.each(result.message, function(notify) {
                        if (notify.is_read == false) {
                            read_count++;
                        }

                        if (notify.avatar == null) {
                            notify.avatar = "default_male.png"
                        }
                        notifyModel = Ext.create('Igor.model.Notification', notify);
                        notifyStore.add(notifyModel);

                        if (read_count != 0) {
                            //console.log(read_count);
                            //mainPanel.getTabBar().getComponent(0).setBadgeText(read_count);
                        }
                        //console.log(notify);

                    });
                }
            }
        });
    },

    onSubjectListInit: function() {

        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });


        var userId = Ext.getStore('Users').getAt(0).get('userid');        

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/subject/call/jsonp/get_all_subjects',

            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                mainPanel = Ext.ComponentQuery.query('mainpanel')[0];
                mainPanel.unmask();

                if (result.status = 'OK') {
                    var subjectStore = Ext.getStore('Subjects'),
                        subjectModel = {}, read_count = 0;

                        subjectStore.removeAll();

                    Ext.Array.each(result.message, function(subject) {
                        
                        subjectModel = Ext.create('Igor.model.Subject', subject);
                        subjectStore.add(subjectModel);

                        // console.log(subject);
                    });

                    Ext.ComponentQuery.query('#subjectList')[0].setRecord(subjectStore.data.all);

                }

            }
        });

        //this.getSubjectList().setRecord(Ext.getStore('Subjects').data);
    },

    onSelectClassesListInit: function () {
        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });


        // var userId = Ext.getStore('Users').getAt(0).get('userid');        

        Ext.data.JsonP.request({
            url: 'https://igor-assistant-ca-2012.appspot.com/igor/class_subject/call/jsonp/get_classes_by_subject/',
            params: {
                subject_id: '4007',
                // term      : '20111'
                term : '',
            },

            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                mainPanel = Ext.ComponentQuery.query('mainpanel')[0];
                mainPanel.unmask();

                if (result.status = 'OK') {
                    var classDetailStore = Ext.getStore('Classdetails'),
                        classDetailModel = {}, read_count = 0;

                        classDetailStore.removeAll();

                    Ext.Array.each(result.message, function(classDetail) {
                        
                        classDetailModel = Ext.create('Igor.model.Classdetail', classDetail);
                        classDetailStore.add(classDetailModel);

                        // console.log(subject);
                    });

                    Ext.ComponentQuery.query('#selectClassesList')[0].setRecord(classDetailStore.data.all);

                }

            }
        });
    },

    onNewProjectInit: function() {
        var id = this.getNewProjectForm().getClassid();
        var classId = Ext.getStore('Classdetails').getAt(0).get('class_id');

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/user/call/jsonp/get_users_by_class',
            params: {
                class_id: classId,
            },
            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                mainPanel = Ext.ComponentQuery.query('mainpanel')[0];
                mainPanel.unmask();

                if (result.status = 'OK') {
                    var classUserStore = Ext.getStore('Classusers'),
                        classUserModel = {};

                        classUserStore.removeAll();

                    Ext.Array.each(result.message, function(user) {
                        classUserModel = Ext.create('Igor.model.Classuser', user);
                        classUserStore.add(classUserModel);
                    });
                }
            }
        });
        
    },

    onDayToggle: function(container, button, pressed, eOpts){
        //console.log("User toggled the '" + button.getText() + button.getId() + "' button: " + (pressed ? 'on' : 'off'));
        if (pressed) {
            /*style = {
                'width': window.innerWidth + 'px',
                '-webkit-transition': 'width 1s',
                '-webkit-transition-delay': '100ms'
            };
            //button.setWidth(window.innerWidth);
            button.setCentered(true);
            if (!button.rendered) {
                button.setStyle(style);
            }
            else {
                button.element.applyStyles(style);
            }
            button.replaceCls('x-phapphui-in', 'x-phapphui-out');*/
            window.location.href = 'index.html#tasks/taskbyday/' + button.getItemId();
        }
        else {
            /*style = {
                'width': '95px',
                '-webkit-transition': 'width 1s',
                '-webkit-transition-delay': '100ms'
            };
            button.setCentered(false);
            button.setStyle('');
            //button.setWidth('95px');
            //button.setStyle('transition:width 5s;-webkit-transition:width 5s;');
            //console.log(button.getStyle());
            button.replaceCls('x-phapphui-out', 'x-phapphui-in');
            if (!button.rendered) {
                button.style = style;
            }
            else {
                button.element.applyStyles(style);
            }*/
            
        }
    },

    onProfilePop: function(){
        var editProfileBtn = this.getEditProfileButton();
        editProfileBtn.show();
    },

    onTaskPop: function(){
        var taskForm = this.getTasksForm();
        var previousCtn = taskForm.getPreviousItem();
        var addTaskBtn = this.getAddTaskBtn();

        //console.log(activeCtn.getItemId());

        if (previousCtn == null) {
            addTaskBtn.setHandler(function() {
                var navView = this.up('navigationview');
                var termBtn = Ext.ComponentQuery.query('#termSelectBtn')[0];
                navView.push({xtype: 'newTask'});
                this.hide();
                termBtn.hide();
            });
            this.getTermSelBtn().show();
            addTaskBtn.show();
        }    
        else if (previousCtn.getItemId().indexOf('scheduler') != -1) {
            //console.log(previousCtn.getItemId());     
            addTaskBtn.show();
            addTaskBtn.setHandler(this.getFuncForAddBtn("class"));
        }
        else if (previousCtn.getItemId().indexOf('classDetailsForm') != -1) {
            addTaskBtn.show();
            addTaskBtn.setHandler(this.getFuncForAddBtn("project"));
        }
    },

    onTaskPush: function(){
        var taskForm = this.getTasksForm();
        var activeCtn = taskForm.getActiveItem();

        if (activeCtn.getItemId().indexOf('classDetailsForm') != -1) {
            //console.log(activeCtn.getItemId());
            this.getAddTaskBtn().setHandler(this.getFuncForAddBtn("class"));
        }
        else if (activeCtn.getItemId().indexOf('projectDetailsForm') != -1) {
            this.getAddTaskBtn().setHandler(this.getFuncForAddBtn("project"));
        }
        else if (activeCtn.getItemId().indexOf('classTaskDetailsForm') != -1) {
            this.getAddTaskBtn().hide();
        }
        else if (activeCtn.getItemId().indexOf('jobDetailsForm') != -1) {
            this.getAddTaskBtn().hide();
        }
        else if (activeCtn.getItemId().indexOf('newTask') != -1) {
            this.onSubjectListInit();
            this.getSubjectList().setStore('Subject');
            this.getTermSelBtn().hide();
        }
        else if (activeCtn.getItemId().indexOf('addclassForm') != -1) {
            this.onSelectClassesListInit();
            this.getNewClassForm().setStore('Classdetails');
            this.getTermSelBtn().hide();
        }
    },

    viewUpdateDetails: function(list, index, target, record){
        // Show 1 popup để hiển thị details của notification này
        // Trên popup này sẽ có 1 nút "Read/Unread" để xác định việc xem notification này, 
        // sử dụng hàm Mark_read(notifications) trong file .doc
        var rec = list.getStore().getAt(index);
        //console.log(rec.data);

        window.location.href = 'index.html#classJobTaskDetails/' + rec.get('objectid');
        this.getUpdatesListForm().push({xtype: 'jobDetailsForm'});
        //this.getTasksForm().push({xtype: 'jobDetailsForm'});
    },

    // Tasks
    // Hàm này thực hiện chính: khi có routes báo #tasks thì hàm này sẽ thực hiện tất cả các thao tác 
    // để đưa dữ liệu lên list chính
    doTasks: function() {
        // Thực hiện 2 hàm Filters trước
        this.showTasksByUser();
    },

    // (*) WS lấy về toàn bộ các tasks
    getAllTasksByUser: function(id) {
        // Sử dụng hàm Get_scheduler(user_id, int term=current) trong file .doc
    },

    // Hàm này lấy về thời gian hiện tại
    getCurrentTime: function() {
        // Thông tin về thời gian hiện tại sẽ cần cho việc hiển thị tasks focus vào khoảng thời gian hiện tại
    },

    // Hàm này sẽ bind dữ liệu đã load về lên giao diện tương ứng
    showTasksByUser: function() {
        
    },

    // Hàm này thực hiện khi click vào 1 tab Day cụ thể
    showTasksByDay: function(day_of_week) {

        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        
        var userId = Ext.getStore('Users').getAt(0).get('userid');

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/class_subject/call/jsonp/get_classes_by_user_time',
            params: {
                user_id: userId,
                // term: '20113', 
                day_of_week: day_of_week
            },
            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                Ext.ComponentQuery.query('mainpanel')[0].unmask();

                if (result.status = 'OK') {
                    var taskStore = Ext.getStore('Tasks'),
                        taskModel = {};

                    taskStore.removeAll();

                    Ext.Array.each(result.message, function(scheduler) {
                        taskModel = Ext.create('Igor.model.Task', scheduler);
                        taskStore.add(taskModel);
                        //console.log(scheduler);

                    });
                }        
            }
        });
    },

    // Hàm này thực hiện khi click vào 1 item trên list tasks theo Day/Week...
    viewTaskDetails: function(id) {
        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        // Get Class Details by class_id
        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/class_subject/call/jsonp/get_class_detail',
            params: {
                id: id
            },
            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                Ext.ComponentQuery.query('mainpanel')[0].unmask();

                if (result.status = 'OK') {
                    var classDetailStore = Ext.getStore('Classdetails'),
                        classDetailModel = {};

                    classDetailStore.removeAll();

                    Ext.Array.each(result.message, function(classdetail) {
                        classDetailModel = Ext.create('Igor.model.Classdetail',classdetail);
                        classDetailStore.add(classDetailModel);
                        //console.log(classdetail);
                    });
                    Ext.ComponentQuery.query('tasksForm')[0].push({xtype: 'classDetailsForm'});
                }
            }
        });
    
        // Get All Projects of Class by class_id
        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/project/call/jsonp/get_project_by_class/',
            params: {
                class_id: id
            },
            disableCaching: false,

            success: function(result, request) {
                var projectClassStore = Ext.getStore('Classprojects'), classProjectDetails = {};
                    projectClassStore.removeAll();
                    projectClassStore.sync();
                if (result.status == 'OK' && result.message != '') {
                    Ext.Array.each(result.message, function(classProject) {      
                        classProjectDetails = Ext.create('Igor.model.Classproject', classProject);
                        projectClassStore.add(classProjectDetails);
                        projectClassStore.sync();
                    });
                }
            }
        });

        // Get All Tasks/Jobs of Class by class_id
        var user_id = Ext.getStore('Users').getAt(0).get('userid');
        Ext.data.JsonP.request({
            url: 'https://igor-assistant-ca-2012.appspot.com/igor/jobs/call/jsonp/get_jobs_by_class/',
            params: {
                user_id: user_id,
                class_id: id
            },
            disableCaching: false,

            success: function(result, request) {
                var classTaskStore = Ext.getStore('Classtasks'), classTaskDetails = {};
                    classTaskStore.removeAll();
                    classTaskStore.sync();
                if (result.status == 'OK' && result.message != '') {
                    Ext.Array.each(result.message, function(classTask) {      
                        classTaskDetails = Ext.create('Igor.model.Classtask', classTask);
                        classTaskStore.add(classTaskDetails);
                        classTaskStore.sync();
                    });
                }
            }
        });
    },

    // User
    viewUserDetails: function(userid) {
        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/user/call/jsonp/get_user_detail',
            params: {
                id: userid
            },
            disableCaching: false,

            success: function(result, request) {
                // Unmask the viewport
                Ext.ComponentQuery.query('mainpanel')[0].unmask();

                if (result.status = 'OK') {
                    var profileStore = Ext.getStore('Profiles'),
                        profileModel = {};

                    profileStore.removeAll();

                    Ext.Array.each(result.message, function(profile) {
                        profileModel = Ext.create('Igor.model.Profile',profile);
                        profileStore.add(profileModel);
                        //console.log(classdetail);
                    });
                    //Ext.ComponentQuery.query('tasksForm')[0].push({xtype: 'classDetailsForm'});
                }
            }
        });
    },

    // (*) WS lấy về thông tin chi tiết user theo ID
    getUserDetails: function(id) {
        // sử dụng hàm Get_user_detail(user_id) trong file .doc
    },

    // (*) WS lấy về toàn bộ class list của user này theo ID
    getClassesListByUser: function(user_id) {
        // Sử dụng hàm Get_classes_by_user(user_id) trong file .doc
    },

    // Hàm này xem thông tin chi tiết về lớp theo ID tương ứng (màn hình Class Details)
    viewClassDetails: function(id) {
        this.redirectTo('url'); // Cập nhật route
    },

    getFuncForAddBtn: function(viewName) {
        var taskForm = this.getTasksForm();
        var activeCtn = taskForm.getActiveItem();

        if (viewName == "class") {
            return function() {
                this.actions = Ext.Viewport.add({
                    xtype: 'actionsheet',
                    items: [
                        {
                            text: 'Add New Project',
                            scope: this,
                            handler: function() {
                                taskForm.push({xtype: 'newProjectForm'});
                                this.hide();
                                this.actions.hide();
                            }
                        },
                        {
                            text: 'Add New Task',
                            scope: this,
                            handler: function() {
                                taskForm.push({xtype: 'newClassTaskForm'});
                                this.hide();
                                this.actions.hide();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cancel',
                            scope: this,
                            handler: function() {
                                this.actions.hide();
                            }
                        }
                    ]
                });

                this.actions.show();
            }
        }
        else if (viewName == "project") {
            return function() {
                this.actions = Ext.Viewport.add({
                    xtype: 'actionsheet',
                    items: [
                        {
                            text: 'Add New Member',
                            scope: this,
                            handler: function() {
                                taskForm.push({xtype: 'newProjectForm'});
                                this.hide();
                                this.actions.hide();
                            }
                        },
                        {
                            text: 'Add New Job',
                            scope: this,
                            handler: function() {
                                taskForm.push({xtype: 'newClassTaskForm'});
                                this.hide();
                                this.actions.hide();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cancel',
                            scope: this,
                            handler: function() {
                                this.actions.hide();
                            }
                        }
                    ]
                });

                this.actions.show();
            }
        }

    },

    doSaveUpdatedProfile: function() {
        var userId = Ext.getStore('Users').getAt(0).get('userid');
        var profileForm = this.getProfileEditForm().getValues();
        var fullNameText = profileForm['fullname'];
        var studentIDText = profileForm['studentid'];
        var courseText = profileForm['course'];
        var groupText = profileForm['group'];
        var avatarText = profileForm['avatarPath'];
        if (fullNameText != '' && studentIDText != '') {
            Ext.data.JsonP.request({
                url: 'https://igor-assistant-ca-2012.appspot.com/igor/user/call/jsonp/update_user_detail/',
                params: {
                    user_id: userId,
                    name: fullNameText,
                    class_group: groupText,
                    student_code: studentIDText,
                    user_course: courseText,
                    avatar: avatarText
                },
                disableCaching: false,
                success: function(result, request) {
                    if (result.status == 'OK' && result.message != '') {
                        var store = Ext.getStore('Users'), userDetails = {};
                        store.removeAll();
                        store.sync();
                        Ext.Array.each(result.message, function(user) {
                            userDetails = Ext.create('Igor.model.User', user);
                            userDetails.set('loggedIn', true);
                            store.add(userDetails);
                            store.sync();
                        });
                        Ext.Viewport.setActiveItem(Ext.create('Igor.view.Main'));
                    } else {
                        Ext.Msg.alert('Failed updating!');
                    }
                }
            });
        } else {
            Ext.Msg.alert('Not enough information!');
        }
    },

    onSubjectTapHold: function(list, index, target, record) {
        window.location.href = 'index.html#subjectDetails/' + record.get('subject_id');
        this.getTasksForm().push({xtype: 'subjectDetailsForm'});
    },

    doSaveNewClassTask: function() {
        var newClassTaskForm = this.getNewClassTaskForm().getValues();
        var name = newClassTaskForm['name'];
        var location = newClassTaskForm['location'];
        var note = newClassTaskForm['note'];
        var startDate = newClassTaskForm['startdate'];
        var startTime = newClassTaskForm['starttime'];
        var endDate = newClassTaskForm['enddate'];
        var endTime = newClassTaskForm['endtime'];
        var userId = Ext.getStore('Users').getAt(0).get('userid');
        var currentHref = window.location.href;
        var getParamsId = currentHref.split("#", 2)[1];
        var classId = getParamsId.split("/", 2)[1];

        if (name != '' && location != '') {
            Ext.data.JsonP.request({    
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/jobs/call/jsonp/add_class_job/',
            params: {
                user_id: userId,
                name: name,
                job_type: 0,
                note: note,
                location: location,
                class_id: classId
            },
            disableCaching: false,

            success: function(result, request) {
                if (result.status == 'OK' && result.message != '') {
                    var store = Ext.getStore('Classtasks'), classTaskDetails = {};
                        store.sync();
                        Ext.Array.each(result.message, function(classTask) {
                            classTaskDetails = Ext.create('Igor.model.Classtask', classTask);
                            store.add(classTaskDetails);
                            store.sync();
                        });

                    Ext.Viewport.setActiveItem(Ext.create('Igor.view.Main'));
                } else {
                    Ext.Msg.alert('Failed! Try again!');
                }
            }
        });
        } else {
            Ext.Msg.alert('Not enough information!');
        }
    },

    doSaveNewProject: function() {
        var newProjectForm = this.getNewProjectForm().getValues();
        var nameProject = newProjectForm['name'];
        var description = newProjectForm['description'];

        if (nameProject != '' && description != '') {

        } else {
            Ext.Msg.alert('Not enough information!');
        }
    },

    doClassTaskTap: function(list, index, target, record) {
        window.location.href = 'index.html#classJobTaskDetails/' + record.get('id');
        this.getTasksForm().push({xtype: 'jobDetailsForm'});
    },

    viewJobTaskDetails: function(id) {
        this.getMainPnl().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/jobs/call/jsonp/get_jobs_detail/',
            params: {
                job_id: id
            },
            disableCaching: false,

            success: function(result, request) {
                Ext.ComponentQuery.query('mainpanel')[0].unmask();

                if (result.status = 'OK' && result.message != '') {
                    var store = Ext.getStore('Classtasks'), classJobTaskDetails = {};
                        store.removeAll();
                        store.sync();
                    Ext.Array.each(result.message, function(classJobTask) {
                        classJobTaskDetails = Ext.create('Igor.model.Classtask', classJobTask);
                        store.add(classJobTaskDetails);
                        store.sync();
                    });
                }
            }
        });
    },

    doSetCompletedMark: function() {
        var currentHref = window.location.href;
        var getParamsId = currentHref.split("#", 2)[1];
        var jobId = getParamsId.split("/", 2)[1];

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/jobs/call/jsonp/mark_job_finished/',
            params: {
                job_id: jobId
            },
            disableCaching: false,

            success: function(result, request) {
                if (result.status = 'OK' && result.message != '') {
                    Ext.Viewport.setActiveItem(Ext.create('Igor.view.Main'));
                } else {
                    Ext.Msg.alert('Failed! Try again!');
                }
            }
        });
    },

    doDeleteJob: function() {
        var currentHref = window.location.href;
        var getParamsId = currentHref.split("#", 2)[1];
        var jobId = getParamsId.split("/", 2)[1];

        Ext.data.JsonP.request({
            url: 'http://igor-assistant-ca-2012.appspot.com/igor/jobs/call/jsonp/delete_job/',
            params: {
                job_id: jobId
            },
            disableCaching: false,

            success: function(result, request) {
                if (result.status = 'OK' && result.message != '') {
                    Ext.Viewport.setActiveItem(Ext.create('Igor.view.Main'));
                } else {
                    Ext.Msg.alert('Failed! Try again!');
                }
            }
        });
    }
});