Attribute Module_Name = "Module2"

//====================== 用户窗体桥接（参数设置窗） ======================
// 说明：WPS 宏编辑器里插入的窗体/控件若无法重命名，就使用默认名称；
//       本段同时兼容窗体名“参数设置窗”“UserForm1”“UserForm”。
//       若你的编辑器支持手动绑定事件：4 个复选框的 Click 绑到“窗体_同步启用”，
//       确定按钮绑到“窗体_点击确定”，取消按钮绑到“窗体_点击取消”。

// 注意：WPS JSA 的模块级代码只允许“函数声明”，不能写变量初始化/赋值，
//       所以窗体状态放在函数属性里，控件名表用函数返回。

function 窗体_状态(){
    if (!窗体_状态.数据) {
        窗体_状态.数据 = { 确认: false };
    }
    return 窗体_状态.数据;
}

function 窗体控件表(){
    return {
        勾选: ["CheckBox1", "CheckBox2", "CheckBox3", "CheckBox4"],
        命名: ["TextBox1", "TextBox2", "TextBox3", "TextBox4"],
        确定: ["CommandButton1", "PushButton1"],
        取消: ["CommandButton2", "PushButton2"]
    };
}

function 是窗体对象(对象){
    if (!对象) return false;
    try { return typeof 对象.Show === "function"; } catch(e) { return false; }
}

function 取全局(名称){
    try { let v = eval(名称); if (v !== undefined && v !== null) return v; } catch(e) {}
    try { if (typeof globalThis !== "undefined" && globalThis[名称]) return globalThis[名称]; } catch(e) {}
    return null;
}

// 尝试枚举全局对象里“像窗体”的名字，这样窗体叫什么都可能被找到
function 枚举疑似窗体(){
    let 结果 = [];
    try {
        let g = null;
        try { g = globalThis; } catch(e) {}
        if (!g) { try { g = this; } catch(e) {} }
        if (!g) return 结果;
        let 键 = Object.keys(g);
        for (let i = 0; i < 键.length; i++) {
            let k = 键[i];
            if (!/form|dialog|窗体|窗口|设置窗/i.test(k)) continue;
            let v = null;
            try { v = g[k]; } catch(e) { continue; }
            if (是窗体对象(v)) 结果.push(k);
        }
    } catch(e) {}
    return 结果;
}

function 窗体候选名单(){
    return [
        "参数设置窗", "设置窗", "参数窗", "参数设置", "对话框", "设置对话框",
        "UserForm1", "UserForm2", "UserForm3", "UserForm4", "UserForm5",
        "UserForm6", "UserForm7", "UserForm8", "UserForm",
        "Form1", "Form2", "Form3", "窗体1", "窗体2", "窗体3", "窗体4",
        "用户窗体1", "用户窗体2", "用户窗体3"
    ];
}

function 取窗体(){
    // 1) 枚举：能自动发现任意名字的窗体
    let 枚举 = 枚举疑似窗体();
    if (枚举.length > 0) {
        let v = 取全局(枚举[0]);
        if (是窗体对象(v)) return v;
    }
    // 2) 候选名单
    let 名单 = 窗体候选名单();
    for (let i = 0; i < 名单.length; i++) {
        let 对象 = 取全局(名单[i]);
        if (是窗体对象(对象)) return 对象;
    }
    // 3) 直接引用三个最常见名字（eval 不可用时兜底）
    try { if (typeof 参数设置窗 !== "undefined" && 是窗体对象(参数设置窗)) return 参数设置窗; } catch(e) {}
    try { if (typeof UserForm1 !== "undefined" && 是窗体对象(UserForm1)) return UserForm1; } catch(e) {}
    try { if (typeof UserForm !== "undefined" && 是窗体对象(UserForm)) return UserForm; } catch(e) {}
    return null;
}

function 窗体控件(f, 名称){
    if (!f) return null;
    try { let c = f.Controls(名称); if (c) return c; } catch(e) {}
    try { let c = f.Controls.Item(名称); if (c) return c; } catch(e) {}
    try { let c = f[名称]; if (c) return c; } catch(e) {}
    return null;
}

function 取勾选(f, 名称){
    let c = 窗体控件(f, 名称);
    if (!c) return false;
    let v = null;
    try { v = c.Value; } catch(e) {}
    if (v === null || v === undefined) { try { v = c.Checked; } catch(e) {} }
    if (v === true || v === -1 || v === 1) return true;
    if (typeof v === "string") return v.toLowerCase() === "true" || v === "-1" || v === "1";
    return false;
}

function 取文本(f, 名称){
    let c = 窗体控件(f, 名称);
    if (!c) return "";
    let v = null;
    try { v = c.Value; } catch(e) {}
    if (v === null || v === undefined || v === "") {
        try {
            let t = c.Text;
            if (t !== undefined && t !== null) v = t;
        } catch(e) {}
    }
    return (v === null || v === undefined) ? "" : String(v);
}

function 设文本(f, 名称, 值){
    let c = 窗体控件(f, 名称);
    if (!c) return;
    try { c.Value = 值; return; } catch(e) {}
    try { c.Text = 值; } catch(e) {}
}

function 设勾选(f, 名称, 开){
    let c = 窗体控件(f, 名称);
    if (!c) return;
    try { c.Value = !!开; return; } catch(e) {}
    try { c.Value = 开 ? -1 : 0; } catch(e) {}
}

function 设启用(f, 名称, 开){
    let c = 窗体控件(f, 名称);
    if (!c) return;
    try { c.Enabled = !!开; } catch(e) {}
}

function 设标题(f, 名称, 文字){
    let c = 窗体控件(f, 名称);
    if (!c) return;
    try { c.Caption = 文字; return; } catch(e) {}
    try { c.Text = 文字; } catch(e) {}
}

function 设位置(f, 名称, 左, 上, 宽, 高){
    let c = 窗体控件(f, 名称);
    if (!c) return;
    try { c.Move(左, 上, 宽, 高); } catch(e) {}
}

// 勾选/取消勾选后立即同步：勾选→命名框解锁；取消→命名框锁定
function 窗体_同步启用(){
    let f = 取窗体();
    if (!f) return;
    for (let i = 0; i < 4; i++) {
        设启用(f, 窗体控件表().命名[i], 取勾选(f, 窗体控件表().勾选[i]));
    }
}

function 窗体_结束(确认){
    窗体_状态().确认 = !!确认;
    let f = 取窗体();
    if (f) { try { f.Hide(); } catch(e) {} }
}

function 窗体_点击确定(){ 窗体_结束(true); }
function 窗体_点击取消(){ 窗体_结束(false); }

function 窗体_控件齐全(f){
    for (let i = 0; i < 4; i++) {
        if (!窗体控件(f, 窗体控件表().勾选[i]) || !窗体控件(f, 窗体控件表().命名[i])) return false;
    }
    return true;
}

// 诊断：检查窗体与控件是否都能找到（可在宏列表里单独运行）
function 诊断参数窗体(){
    let 枚举 = 枚举疑似窗体();
    let 名单 = 窗体候选名单();
    let 存在 = [];
    for (let i = 0; i < 名单.length; i++) {
        let v = 取全局(名单[i]);
        if (v !== null && v !== undefined) 存在.push(名单[i] + (是窗体对象(v) ? "（是窗体）" : "（非窗体）"));
    }
    
    let f = 取窗体();
    if (!f) {
        alert(
            "没有找到可用的用户窗体。\n\n" +
            "枚举到的疑似窗体：" + (枚举.length ? 枚举.join("、") : "无") + "\n" +
            "候选名检查结果：" + (存在.length ? 存在.join("、") : "无") + "\n\n" +
            "请检查：\n" +
            "1. 宏编辑器左侧工程里是否已插入“用户窗体”；\n" +
            "2. 窗体是否和这段代码在同一个文档的宏工程里；\n" +
            "3. 若刚在宏编辑器里改过代码，请先保存，关闭文档重开后再运行\n" +
            "   （WPS 已知问题：改代码后窗体引用会临时失效）。"
        );
        return;
    }
    
    let 控件名 = ["CheckBox1","CheckBox2","CheckBox3","CheckBox4",
                  "TextBox1","TextBox2","TextBox3","TextBox4",
                  "CommandButton1","CommandButton2","PushButton1","PushButton2"];
    let 行 = ["已找到窗体，控件检测：", ""];
    for (let i = 0; i < 控件名.length; i++) {
        行.push(控件名[i] + "：" + (窗体控件(f, 控件名[i]) ? "有" : "无"));
    }
    alert(行.join("\n"));
}

// 事件回调：按“窗体名_cb_控件名_Click”命名，同时覆盖两种常见窗体名
function 参数设置窗_cb_CheckBox1_Click(){ 窗体_同步启用(); }
function 参数设置窗_cb_CheckBox2_Click(){ 窗体_同步启用(); }
function 参数设置窗_cb_CheckBox3_Click(){ 窗体_同步启用(); }
function 参数设置窗_cb_CheckBox4_Click(){ 窗体_同步启用(); }
function 参数设置窗_cb_CommandButton1_Click(){ 窗体_点击确定(); }
function 参数设置窗_cb_CommandButton2_Click(){ 窗体_点击取消(); }
function 参数设置窗_cb_PushButton1_Click(){ 窗体_点击确定(); }
function 参数设置窗_cb_PushButton2_Click(){ 窗体_点击取消(); }

function UserForm1_cb_CheckBox1_Click(){ 窗体_同步启用(); }
function UserForm1_cb_CheckBox2_Click(){ 窗体_同步启用(); }
function UserForm1_cb_CheckBox3_Click(){ 窗体_同步启用(); }
function UserForm1_cb_CheckBox4_Click(){ 窗体_同步启用(); }
function UserForm1_cb_CommandButton1_Click(){ 窗体_点击确定(); }
function UserForm1_cb_CommandButton2_Click(){ 窗体_点击取消(); }
function UserForm1_cb_PushButton1_Click(){ 窗体_点击确定(); }
function UserForm1_cb_PushButton2_Click(){ 窗体_点击取消(); }

// 事件回调之二：WPS 另一种事件命名“窗体名_控件名_Click”（不带 cb）
function 参数设置窗_CheckBox1_Click(){ 窗体_同步启用(); }
function 参数设置窗_CheckBox2_Click(){ 窗体_同步启用(); }
function 参数设置窗_CheckBox3_Click(){ 窗体_同步启用(); }
function 参数设置窗_CheckBox4_Click(){ 窗体_同步启用(); }
function 参数设置窗_CommandButton1_Click(){ 窗体_点击确定(); }
function 参数设置窗_CommandButton2_Click(){ 窗体_点击取消(); }
function 参数设置窗_PushButton1_Click(){ 窗体_点击确定(); }
function 参数设置窗_PushButton2_Click(){ 窗体_点击取消(); }

function UserForm1_CheckBox1_Click(){ 窗体_同步启用(); }
function UserForm1_CheckBox2_Click(){ 窗体_同步启用(); }
function UserForm1_CheckBox3_Click(){ 窗体_同步启用(); }
function UserForm1_CheckBox4_Click(){ 窗体_同步启用(); }
function UserForm1_CommandButton1_Click(){ 窗体_点击确定(); }
function UserForm1_CommandButton2_Click(){ 窗体_点击取消(); }
function UserForm1_PushButton1_Click(){ 窗体_点击确定(); }
function UserForm1_PushButton2_Click(){ 窗体_点击取消(); }


function 模板自动化word函数(){
    
//--------------------------弹窗交互函数----------------------------------
    // 说明：WPS JS宏 MsgBox 的按钮/图标取值（对应 JSMsgBoxStyle 枚举）
    const MSG_YES_NO_CANCEL = 3;
    const MSG_YES_NO = 4;
    const MSG_ICON_QUESTION = 32;
    
    // 单个是/否/取消弹窗：返回 true=是，false=否，null=取消
    function 弹窗选择(内容, 标题, 允许取消){
        let 按钮 = (允许取消 ? MSG_YES_NO_CANCEL : MSG_YES_NO) + MSG_ICON_QUESTION;
        let 结果 = Number(MsgBox(内容, 按钮, 标题));
        if (结果 === 2) return null;                // 取消
        if (结果 === 7) return false;               // 否
        if (结果 === 6 || 结果 === 1) return true;  // 是 / 确定
        return null;
    }
    
    // 计算选中区域中未隐藏的列数（用于校验占位符编号），取不到时返回 0 表示跳过该检查
    function 取可见列数(datas){
        try {
            let 工作表 = Application.ActiveSheet;
            let 起始列 = parseInt(datas.Column);
            let 列总数 = parseInt(datas.Columns.Count);
            let 可见列数 = 0;
            for (let j = 0; j < 列总数; j++) {
                if (!工作表.Columns(起始列 + j).Hidden) 可见列数++;
            }
            return 可见列数;
        } catch(e) {
            return 0;
        }
    }
    
    // 校验命名：返回空字符串表示有效，否则返回无效原因（多条用“；”连接）
    function 校验命名(文本, opts){
        if (文本 === "") {
            return "命名不能为空；若想" + opts.取消说明 + "，请点“取消”";
        }
        
        let 错误 = [];
        let 占位符匹配 = 文本.match(new RegExp(opts.占位符正则.source, "g"));
        if (!占位符匹配) {
            错误.push("必须包含" + opts.占位符示例 + "形式的" + opts.占位符名称 + "占位符");
        } else {
            if (opts.最大编号 > 0) {
                let 越界 = [];
                let 检查正则 = new RegExp(opts.占位符正则.source, "g");
                let m;
                while ((m = 检查正则.exec(文本)) !== null) {
                    let 编号 = parseInt(m[1], 10);
                    if (!(编号 >= 1 && 编号 <= opts.最大编号)) 越界.push(m[0]);
                }
                if (越界.length > 0) {
                    错误.push("占位符编号超出范围：" + 越界.join("、") + "（表格共 " + opts.最大编号 + " 列）");
                }
            }
            if (opts.检查文件名字符) {
                let 剩余文本 = 文本.replace(new RegExp(opts.占位符正则.source, "g"), "X");
                if (/[\\/:*?"<>|]/.test(剩余文本)) 错误.push('不能包含 \\ / : * ? " < > | 等字符');
                if (/[ .]$/.test(文本)) 错误.push("结尾不能是空格或英文句点");
                if (文本.length > 120) 错误.push("长度不能超过120个字符");
            }
            if (opts.禁用扩展名 && /\.(docx?|pdf)$/i.test(文本)) {
                错误.push("不用写扩展名，系统会自动添加 .docx 或 .pdf");
            }
        }
        return 错误.join("；");
    }
    
    // 命名输入弹窗：无效时在原弹窗顶部提示原因并要求重新输入；点“取消”使用默认命名
    function 弹窗输入规则(opts){
        let 上次输入 = "";
        let 无效原因 = "";
        while (true) {
            let 前置提示 = "";
            if (无效原因 !== "") {
                前置提示 = "【命名无效】" + 无效原因 + "\n\n请修改后重新输入；若想" + opts.取消说明 + "，请点“取消”。\n\n";
            }
            let input = Application.InputBox(
                前置提示 + opts.提示,
                undefined,
                (上次输入 !== "" ? 上次输入 : undefined),
                undefined, undefined, undefined, undefined, 2);
            
            if (input === false || input === undefined || input === null) {
                return opts.默认命名;
            }
            
            let 文本 = String(input).trim();
            无效原因 = 校验命名(文本, opts);
            if (无效原因 === "") return 文本;
            上次输入 = 文本;
        }
    }
    
    // 参数弹窗：逐项点选，选完一项紧接着弹窗输入该项的自定义命名，最后统一确认
    // 返回 { params: ["0"/"1" x4], rules: {folder, word, pdf, photo} }，取消返回 null
    function 参数弹窗设置(datas){
        if (typeof MsgBox !== "function") {
            alert("当前WPS版本不支持弹窗选择（MsgBox），请升级WPS后重试");
            return null;
        }
        
        // 占位符能引用的最大列号（按未隐藏列计算；取不到时为 0，跳过范围校验）
        let 最大列号 = 取可见列数(datas);
        
        while (true) {
            // 第1步：嵌套文件夹 → 选中后直接进入该项的命名弹窗
            let 启用嵌套文件夹 = 弹窗选择(
                "【第1步 / 共4步】是否启用嵌套文件夹？\n\n" +
                "· 是：每一行数据单独创建一个子文件夹，用于存放该行生成的文件。\n" +
                "· 否：所有生成的文件统一保存在同一个批量文件夹中。\n\n" +
                "（点“是”或“否”继续，点“取消”退出函数）",
                "word自动化函数 · 参数设置（1/4）", true);
            if (启用嵌套文件夹 === null) return null;
            let 文件夹规则 = "not choose";
            if (启用嵌套文件夹) {
                文件夹规则 = 弹窗输入规则({
                    提示: "【第1步 · 嵌套文件夹命名】\n请命名嵌套文件夹，必须含有文本占位符（如 <1> 会替换为第1列数据）。\n\n点“取消”则使用默认命名。",
                    默认命名: `文件夹_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    占位符正则: /<(\d+)>/,
                    占位符示例: "<1>",
                    占位符名称: "文本",
                    取消说明: "使用默认命名",
                    最大编号: 最大列号,
                    检查文件名字符: true,
                    禁用扩展名: false
                });
            }
            
            // 第2步：word 文件 → 选中后直接进入该项的命名弹窗
            let 生成word = 弹窗选择(
                "【第2步 / 共4步】是否批量生成word文件？\n\n" +
                "· 是：按表格数据生成docx文件。\n" +
                "· 否：不生成word文件。\n\n" +
                "（点“是”或“否”继续，点“取消”退出函数）",
                "word自动化函数 · 参数设置（2/4）", true);
            if (生成word === null) return null;
            let word规则 = "not choose";
            if (生成word) {
                word规则 = 弹窗输入规则({
                    提示: "【第2步 · word文件命名】\n请输入word文档名，必须含有文本占位符（如 <1>），不用写 .docx。\n\n点“取消”则使用默认命名。",
                    默认命名: `word_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    占位符正则: /<(\d+)>/,
                    占位符示例: "<1>",
                    占位符名称: "文本",
                    取消说明: "使用默认命名",
                    最大编号: 最大列号,
                    检查文件名字符: true,
                    禁用扩展名: true
                });
            }
            
            // 第3步：pdf → 选中后直接进入该项的命名弹窗
            let 生成pdf = 弹窗选择(
                "【第3步 / 共4步】是否批量生成pdf文件？\n\n" +
                "· 是：在word基础上另存为pdf（word与pdf都启用时两种格式都会保存）。\n" +
                "· 否：不生成pdf文件。\n\n" +
                "（点“是”或“否”继续，点“取消”退出函数）",
                "word自动化函数 · 参数设置（3/4）", true);
            if (生成pdf === null) return null;
            let pdf规则 = "not choose";
            if (生成pdf) {
                pdf规则 = 弹窗输入规则({
                    提示: "【第3步 · pdf文件命名】\n请输入pdf文件名，必须含有文本占位符（如 <1>），不用写 .pdf。\n\n点“取消”则使用默认命名。",
                    默认命名: `pdf_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    占位符正则: /<(\d+)>/,
                    占位符示例: "<1>",
                    占位符名称: "文本",
                    取消说明: "使用默认命名",
                    最大编号: 最大列号,
                    检查文件名字符: true,
                    禁用扩展名: true
                });
            }
            
            // 第4步：图片另存 → 选中后直接进入该项的占位符弹窗
            let 保存图片 = 弹窗选择(
                "【第4步 / 共4步】是否指定目标列图片批量存入？\n\n" +
                "· 是：识别表格中含 ID_ 的图片名称，把对应图片另存到同一文件夹。\n" +
                "· 否：不另存图片。\n\n" +
                "（点“是”或“否”继续，点“取消”退出函数）",
                "word自动化函数 · 参数设置（4/4）", true);
            if (保存图片 === null) return null;
            let 图片规则 = "not choose";
            if (保存图片) {
                图片规则 = 弹窗输入规则({
                    提示: "【第4步 · 图片占位符】\n请输入需要另存的图片占位符（如 {3}）。\n\n点“取消”则关闭图片另存功能。",
                    默认命名: "not choose",
                    占位符正则: /{(\d+)}/,
                    占位符示例: "{3}",
                    占位符名称: "图片",
                    取消说明: "关闭图片另存功能",
                    最大编号: 最大列号,
                    检查文件名字符: false,
                    禁用扩展名: false
                });
            }
            
            // 统一确认（把每项已输入的命名一起列出）
            let 确认内容 =
                "请确认本次生成设置：\n\n" +
                "1. 嵌套文件夹：" + (启用嵌套文件夹 ? "是（" + 文件夹规则 + "）" : "否") + "\n" +
                "2. word文件：" + (生成word ? "是（" + word规则 + "）" : "否") + "\n" +
                "3. pdf文件：" + (生成pdf ? "是（" + pdf规则 + "）" : "否") + "\n" +
                "4. 图片另存：" + (保存图片 ? "是（" + 图片规则 + "）" : "否") + "\n\n" +
                "· 是：按以上设置开始生成\n" +
                "· 否：重新设置\n" +
                "· 取消：退出函数";
            let 确认 = 弹窗选择(确认内容, "word自动化函数 · 确认设置", true);
            
            if (确认 === null) return null;   // 取消：退出函数
            if (确认 === false) continue;     // 否：回到第1步重新设置
            
            return {
                params: [
                    启用嵌套文件夹 ? "1" : "0",
                    生成word ? "1" : "0",
                    生成pdf ? "1" : "0",
                    保存图片 ? "1" : "0"
                ],
                rules: {
                    folder: 文件夹规则,
                    word: word规则,
                    pdf: pdf规则,
                    photo: 图片规则
                }
            };
        }
    }
    
//--------------------------窗体参数（单窗弹窗）----------------------------------
    // 先弹“参数设置窗”；窗体不存在/控件不全/调用异常时返回 null，由主流程回退到逐项弹窗
    function 参数窗体设置(datas){
        let f = 取窗体();
        if (!f) return null;
        if (!窗体_控件齐全(f)) return null;
        
        let 最大列号 = 取可见列数(datas);
        let 预设 = { 勾选: [false, true, false, false], 命名: ["", "", "", ""] };
        let 首次 = true;
        
        while (true) {
            let 结果 = 显示参数窗体(f, 预设, 首次);
            首次 = false;
            if (!结果) return null;                       // 窗体异常 → 回退逐项弹窗
            if (!结果.确认) return { params: null };       // 取消 → 退出函数
            预设 = 结果;
            
            let 错误 = 校验窗体结果(结果, 最大列号);
            if (错误 === "") return 组装窗体参数(结果);
            
            MsgBox("参数有误：\n\n" + 错误 + "\n\n请修改后重新点“确定”。", 48, "word自动化函数 · 参数设置");
        }
    }
    
    // 显示窗体并取回勾选/命名；返回 null 表示窗体不可用
    function 显示参数窗体(f, 预设, 首次){
        try {
            if (首次) 初始化窗体外观(f);
            for (let i = 0; i < 4; i++) {
                设勾选(f, 窗体控件表().勾选[i], 预设.勾选[i]);
                设文本(f, 窗体控件表().命名[i], 预设.命名[i]);
            }
            窗体_同步启用();
            窗体_状态().确认 = false;
            f.Show();
            
            if (!窗体_状态().确认) {
                let 还可见 = false;
                try { 还可见 = !!f.Visible; } catch(e) {}
                if (还可见) {
                    try { f.Hide(); } catch(e) {}
                    return null;                            // 无模式窗体：无法等待，回退
                }
                return { 确认: false };                      // 直接关闭窗口 = 取消
            }
            
            return {
                确认: true,
                勾选: [
                    取勾选(f, 窗体控件表().勾选[0]), 取勾选(f, 窗体控件表().勾选[1]),
                    取勾选(f, 窗体控件表().勾选[2]), 取勾选(f, 窗体控件表().勾选[3])
                ],
                命名: [
                    取文本(f, 窗体控件表().命名[0]), 取文本(f, 窗体控件表().命名[1]),
                    取文本(f, 窗体控件表().命名[2]), 取文本(f, 窗体控件表().命名[3])
                ]
            };
        } catch(e) {
            try { f.Hide(); } catch(e2) {}
            return null;
        }
    }
    
    // 校验窗体里填写的命名（只校验“已勾选且填写了内容”的项；留空=自动命名）
    function 校验窗体结果(结果, 最大列号){
        let 项 = [
            { 名称: "嵌套文件夹", 正则: /<(\d+)>/, 示例: "<1>", 占位名: "文本", 文件名: true, 扩展名: false },
            { 名称: "word文件",   正则: /<(\d+)>/, 示例: "<1>", 占位名: "文本", 文件名: true, 扩展名: true },
            { 名称: "pdf文件",    正则: /<(\d+)>/, 示例: "<1>", 占位名: "文本", 文件名: true, 扩展名: true },
            { 名称: "图片占位符", 正则: /{(\d+)}/, 示例: "{3}", 占位名: "图片", 文件名: false, 扩展名: false }
        ];
        let 错误 = [];
        for (let i = 0; i < 4; i++) {
            if (!结果.勾选[i]) continue;
            let 文本 = String(结果.命名[i] || "").trim();
            if (文本 === "") continue;
            let 原因 = 校验命名(文本, {
                占位符正则: 项[i].正则,
                占位符示例: 项[i].示例,
                占位符名称: 项[i].占位名,
                取消说明: "不填",
                最大编号: 最大列号,
                检查文件名字符: 项[i].文件名,
                禁用扩展名: 项[i].扩展名
            });
            if (原因 !== "") 错误.push("第" + (i + 1) + "项 " + 项[i].名称 + "：" + 原因);
        }
        return 错误.join("\n");
    }
    
    // 把窗体结果转成原来的 {params, rules} 结构（未勾选或留空 → "not choose" 走默认命名）
    function 组装窗体参数(结果){
        let 规则 = ["not choose", "not choose", "not choose", "not choose"];
        for (let i = 0; i < 4; i++) {
            let 文本 = String(结果.命名[i] || "").trim();
            if (结果.勾选[i] && 文本 !== "") 规则[i] = 文本;
        }
        return {
            params: [
                结果.勾选[0] ? "1" : "0",
                结果.勾选[1] ? "1" : "0",
                结果.勾选[2] ? "1" : "0",
                结果.勾选[3] ? "1" : "0"
            ],
            rules: { folder: 规则[0], word: 规则[1], pdf: 规则[2], photo: 规则[3] }
        };
    }
    
    function 初始化窗体外观(f){
        try { f.Caption = "word自动化函数 · 参数设置"; } catch(e) {}
        设标题(f, 窗体控件表().勾选[0], "① 启用嵌套文件夹（每行一个子文件夹）");
        设标题(f, 窗体控件表().勾选[1], "② 批量生成 word 文件");
        设标题(f, 窗体控件表().勾选[2], "③ 批量生成 pdf 文件");
        设标题(f, 窗体控件表().勾选[3], "④ 指定目标列图片批量存入");
        设标题(f, 窗体控件表().确定[0], "确定");
        设标题(f, 窗体控件表().取消[0], "取消");
        布局参数窗体(f);
    }
    
    // 自动排版（不想用可在 初始化窗体外观 里删掉这一行调用，改用自己的布局）
    function 布局参数窗体(f){
        try { f.Width = 620; } catch(e) {}
        try { f.Height = 420; } catch(e) {}
        for (let i = 0; i < 4; i++) {
            设位置(f, 窗体控件表().勾选[i], 18, 12 + i * 66, 570, 20);
            设位置(f, 窗体控件表().命名[i], 34, 34 + i * 66, 545, 22);
        }
        设位置(f, 窗体控件表().确定[0], 350, 330, 100, 30);
        设位置(f, 窗体控件表().取消[0], 460, 330, 100, 30);
    }
    

//--------------------------主函数----------------------------------
    function 模板自动化word函数最终测试版(){
        let datas = Application.InputBox("请用鼠标选择表格区域", undefined, undefined, undefined, undefined, undefined, undefined, 8);
        
        if(!datas){
            alert("函数已退出");
            return;
        }
        
        //文件选择框（选取word模板文件）
        let fileDialog = Application.FileDialog(msoFileDialogOpen);
        fileDialog.Title = "请选择需要批量生成的word模板";
        let 用户选择结果 = fileDialog.Show();
        
        if(用户选择结果 == 0){
            alert("函数已退出");
            return;
        }
        
        let path = fileDialog.SelectedItems.Item(1);  //word path
        if (!isWordFile(path)){
            alert("该文件不是word文件，函数已退出");
            return;
        }
        //如果用户选择完文件，选中用户选择的表格区域，方便后续读取数据
        datas.Select();
        
        //主函数参数输入（优先弹出“参数设置窗”；窗体不可用时自动回退到逐项弹窗）
        let 设置 = 参数窗体设置(datas);
        if (设置 === null) {
            设置 = 参数弹窗设置(datas);
        }
        if (!设置 || !设置.params) {
            alert("函数已退出");
            return;
        }
        let params = 设置.params;
        
        let Application_ = Application;
        
        let data_obj = {
            vis_data: word_processVisibleData(Application_, datas),
            word_path: path,
            select_sheet: Application_.Selection,
            sheet_shapes: Application_.ActiveSheet.Shapes,
            ActiveSheet: Application_.ActiveSheet,
            photos_sreach_file_array: null,
            params: params,
            save_rules: 设置.rules,
        };
        
        try{
            let word = new Word(data_obj);
            word.word_main();
        }catch(e){
            alert(`报错：${e.message},函数已自动退出`);
        }
    }
    
//=========================自动化功能逻辑类===================================
    class Word{
        constructor({vis_data, word_path, template_word, photos_sreach_file_array, params, save_rules, sheet_shapes}){
            this.word_app = null;
            this.sheet_data = vis_data[0];
            this.photos_path = vis_data[1];
            this.word_path = word_path;
            this.sheet_shapes = sheet_shapes;
            this.photos_sreach_file_array = null;
            this.save_rules = save_rules || null;
            this.folder_save_type = params[0];
            this.word_save_type = params[1];
            this.pdf_save_type = params[2];
            this.photo_save_type = params[3];
            this.rows_data = null;
            this.PDF_WORD_paths = [];
            this.match_arr = new Set();
        }
        
        //主函数
        word_main(){
            let startTime = new Date();
            let endTime;
            try {
                // 先获取保存函数（会弹出所有参数设置输入框），再启动 Word
                let save = this.word_save();
                
                // 创建 Word 应用
                this.word_app = CreateObject("kwps.application");
                this.word_app.Visible = false;
                
                // 打开模板文档（保持打开状态，循环中复制其内容）
                let templateDoc = this.word_app.Documents.Open(this.word_path);
                templateDoc.SaveChanges = false;
                templateDoc.TrackRevisions = false;
                
                // 循环处理每一行数据
                this.sheet_data.forEach((row_data, index) => {
                    // 新建空白文档
                    let new_word = this.word_app.Documents.Add();
                    // 复制模板全部内容
                    templateDoc.Content.Copy();
                    new_word.Content.Paste();
                    
                    this.rows_data = row_data;
                    
                    try {
                        // 文本和图片处理
                        new_word = this.Tables_Modify(new_word, row_data);
                        new_word = this.findTextInShapes(new_word, row_data);
                        
                        // 保存文档
                        save(new_word);
                        new_word = null; // 标记文档已关闭
                    } catch (innerError) {
                        // 如果保存失败或处理出错，确保关闭文档
                        try { if (new_word) new_word.Close(false); } catch(e) {}
                        throw innerError;
                    }
                });
                
                templateDoc.Close(false); // 关闭模板文档
                
                endTime = new Date();
                const timeCost = ((endTime - startTime) / 1000).toFixed(2);
                try {
                    this.word_app.Quit();
                    alert(`函数已执行完成,执行时间为${timeCost}秒\n批量文件夹已自动保存在桌面\n文件夹自动命名为:${this.save_all_name}`);
                } catch(e) {
                    alert(`函数已执行完成,执行时间为${timeCost}秒\n批量文件夹已自动保存在桌面\n文件夹自动命名为:${this.save_all_name},建议启用多组件模式运行（函数运行速度更快）\n如何启用wps多组件模式?->wps主页->全局设置->设置->切换窗口管理模式->多组件模式，设置完后重启wps即可`);
                }
            } catch(e) {
                alert(`报错：${e.message},函数已自动退出`);
            } finally {
                // 清理临时文件夹
                if (this.photos_path) {
                    this.delete_Temp(this.photos_path);
                }
                // 尝试退出word进程
                try {
                    if (this.word_app) this.word_app.Quit();
                } catch(e) {}
            }
        }
        
        //sheet_row_data:二维数组中的每一行内容
        Tables_Modify(doc){
            // 修复：使用正确的 Word 通配符模式匹配 <数字>
            let findText = "[<][0-9]{1,}[>]";
            let searchRange = doc.Content;
            searchRange.Find.ClearFormatting();
            searchRange.Find.Replacement.ClearFormatting();
        
            searchRange.Find.Text = findText;
            searchRange.Find.Forward = true;
            searchRange.Find.Wrap = 1;
            searchRange.Find.Format = false;
            searchRange.Find.MatchCase = false;
            searchRange.Find.MatchWholeWord = false;
            searchRange.Find.MatchWildcards = true;
        
            while (searchRange.Find.Execute()) {
                let matchedText = searchRange.Text;      
                let new_text = matchedText.replace(/<(\d+)>/g, (match, number) => {
                    return this.rows_data[number - 1] ? this.rows_data[number - 1] : "";
                });
                searchRange.Text = new_text;
                searchRange.Collapse(1);
            }
            return doc;
        }
        
        //参数处理逻辑
        word_save(){
            // 修复：添加随机数防止文件夹重名
            let all_name = `批量生成word_创建时间_${this.getCurrentTimeFormatted()}_${Math.floor(Math.random() * 10000)}`;
            let save_Folder_path = `${Env.GetDesktopPath()}/${all_name}`;
            this.save_all_name = all_name;
            FileSystem.mkdirSync(save_Folder_path);
            
            let save = this.path_save;
            let self = this;
            
            let 规则 = this.save_rules || {};
            let folderRule = "not choose";
            if (this.folder_save_type === "1") {
                folderRule = 规则.folder || this.input_box("请命名嵌套文件夹（必须含有文本占位符）", `文件夹_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
            }
        
            let wordRule = "not choose";
            if (this.word_save_type === "1") {
                wordRule = 规则.word || this.input_box("请输入word文档名（必须含有文本占位符）", `word_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
            }
        
            let pdfRule = "not choose";
            if (this.pdf_save_type === "1") {
                pdfRule = 规则.pdf || this.input_box("请输入pdf文件名（必须含有文本占位符）", `pdf_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
            }
            
            let ptRule = "not choose";
            if (this.photo_save_type === "1") {
                ptRule = 规则.photo || this.input_box("请输入需要另存的图片占位符（若没有图片符则自动关闭该参数功能）", "not choose", /{(\d+)}/g);
            }
            
            function saved(doc) {
                let folderPath_Name = "";
                let folder_Full_Path = save_Folder_path;
                if (this.folder_save_type === "1") {
                    folderPath_Name = this.analysis_path_name(folderRule, `文件夹_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
                    folder_Full_Path = `${save_Folder_path}/${folderPath_Name}`;
                    try {
                        FileSystem.mkdirSync(folder_Full_Path);
                    } catch(e) {
                        folderPath_Name = `文件夹_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                        folder_Full_Path = `${save_Folder_path}/${folderPath_Name}`;
                        FileSystem.mkdirSync(folder_Full_Path);
                    }
                }
                
                let wordFullPath = "";
                let wordBackupPath = "";
                if (this.word_save_type === "1") {
                    let wordName = this.analysis_path_name(wordRule, `word_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
                    wordFullPath = `${folder_Full_Path}/${wordName}.docx`;
                    wordBackupPath = `${folder_Full_Path}/word_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}.docx`;
                    let Final_word_path = save(self, doc, wordFullPath, wordBackupPath, 12);
                    this.PDF_WORD_paths.push(Final_word_path);
                }
                
                let pdfFullPath = "";
                let pdfBackupPath = "";
                if (this.pdf_save_type === "1") {
                    let pdfName = this.analysis_path_name(pdfRule, `pdf_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
                    pdfFullPath = `${folder_Full_Path}/${pdfName}.pdf`;
                    pdfBackupPath = `${folder_Full_Path}/pdf_ID_${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}.pdf`;
                    let Final_pdf_path = save(self, doc, pdfFullPath, pdfBackupPath, 17);
                    this.PDF_WORD_paths.push(Final_pdf_path);
                }
                
                if (this.photo_save_type === "1" && ptRule !== "not choose") {
                    if (this.match_arr.size > 0) {
                        this.match_arr.forEach((index) => {
                            if (!this.rows_data[index] || this.rows_data[index] == "" || String(this.rows_data[index]).trim().match(/ID_/) == null) {
                                return;
                            }
                            try {
                                // 修复：清理文件名中的非法字符
                                let photo_Name = this.sanitizeFileName(String(this.rows_data[index]));
                                let shape = this.sheet_shapes.Item(photo_Name);
                                let photo_FullPath = `${folder_Full_Path}/${photo_Name}.png`;
                                shape.SaveAsPicture(photo_FullPath);
                            } catch(e) {
                                // 忽略保存图片时的错误
                            }
                        });
                    }
                }
                
                doc.Close(false);
            }
        
            return saved.bind(this);
        }
        
        // 新增：清理文件名中的非法字符
        sanitizeFileName(name) {
            return name.replace(/[\\/:*?"<>|]/g, "_");
        }
        
        getCurrentTimeFormatted(now = new Date()){
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            return `${year}年${month}月${day}日${hours}点${minutes}分${seconds}秒`;
        }
        
        input_box(text, Default_text, str){
            let match_str = (str) ? str : /<(\d+)>/g;
            let input = Application.InputBox(text, undefined, undefined, undefined, undefined, undefined, undefined, 2);
            // 使用 test 替代 exec，避免全局正则 lastIndex 问题
            return input = String((input && input !== "" && match_str.test(input)) ? input.trim() : Default_text);
        }
        
        analysis_path_name(path_name, Default_name){
            if(path_name == "not choose"){
                return Default_name;
            } else {
                let Name = path_name.replace(/<(\d+)>/g, (match, number) => {
                    return this.rows_data[number - 1] ? this.rows_data[number - 1] : "";
                });
                Name = Name.replace(/[\\/:*?"<>|]/g, "");
                return (Name !== "") ? Name : Default_name;
            }
        }
        
        path_save(self, file, path, Default_path, saveFormat){
            let Final_path = (!self.PDF_WORD_paths.includes(path)) ? path : Default_path;
            try {
                file.SaveAs(Final_path, saveFormat);
            } catch(e) {
                file.SaveAs(Default_path, saveFormat);
                Final_path = Default_path;
            }
            return Final_path;
        }
        
        findTextInShapes(doc, row_data){
            this.match_arr.clear();
            let shapes = doc.Shapes;
            for (let i = shapes.Count; i >= 1; i--) {
                let currentShape = shapes.Item(i);
                if (!currentShape.TextFrame) continue;
                let textFrame = currentShape.TextFrame;
                if (!textFrame.TextRange) continue;
                let shapeText = textFrame.TextRange.Text;
                
                // 检查是否含有文本占位符 <数字>
                let hasTextPlaceholder = /<[0-9]+>/.test(shapeText);
                
                let match_str = /{(\d+)}/g;
                let match1;
                let hasValidImage = false;
                let imageIndex = null;
                
                while ((match1 = match_str.exec(shapeText)) !== null) {
                    let index = parseInt(match1[1]) - 1;
                    if (row_data[index] && row_data[index] !== "" && String(row_data[index]).trim().match(/ID_/) && !String(row_data[index]).trim().match(/=DISPIMG/)) {
                        hasValidImage = true;
                        imageIndex = index;
                        break;
                    }
                }
                
                // 修复：只有同时没有有效图片占位符且没有文本占位符时才删除形状
                if (!hasValidImage && !hasTextPlaceholder) {
                    currentShape.Delete();
                    continue;
                }
                
                if (!hasValidImage) {
                    // 没有图片占位符但有文本占位符，保留形状，继续下一个
                    continue;
                }
                
                this.match_arr.add(imageIndex);
                textFrame.TextRange.Text = "";
                
                let sheet_shape;
                try {
                    sheet_shape = this.sheet_shapes.Item(row_data[imageIndex]);
                } catch(e) {
                    continue;
                }
                
                // 修复：清理图片临时文件名
                let safeImageName = this.sanitizeFileName(String(row_data[imageIndex]));
                let path = `${this.photos_path}/${safeImageName}.png`;
                if (!this.PDF_WORD_paths.includes(path)) {
                    this.PDF_WORD_paths.push(path);
                    sheet_shape.SaveAsPicture(path);
                }
                
                try {
                    currentShape.Fill.UserPicture(path);
                } catch(e) {
                    currentShape.Delete();
                }
            }
            return doc;
        }
        
        delete_Temp(folderPath){
            try {
                let files = FileSystem.readdirSync(folderPath);
                for (let fileName of files) {
                    let fullPath = `${folderPath}/${fileName}`;
                    if (fileName !== "." && fileName !== "..") {
                        FileSystem.Remove(fullPath);
                    }
                }
                FileSystem.rmdirSync(folderPath);
            } catch(e) {
                // 忽略清理错误
            }
        }
    }
    
//----------------------------工具函数-------------------------------------------

    function word_processVisibleData(ap, Ranges) {
        if (!Ranges || Ranges.Count === 0) {
            return [];
        }
        
        let allData = Ranges.Value2;
        if (!Array.isArray(allData)) {
            allData = [[allData]];
        }
        
        const rowCount = Ranges.Rows.Count;
        const colCount = Ranges.Columns.Count;
        
        const visibleRowIndices = [];
        const visibleColIndices = [];
        
        let shapes = ap.ActiveSheet.Shapes;
        let selection = ap.Selection;
        let startRow = parseInt(selection.Row);
        let endRow = startRow + parseInt(selection.Rows.Count) - 1;
        let startCol = parseInt(ap.Selection.Column);
        let endCol = startCol + parseInt(selection.Columns.Count) - 1;
        
        let Folder_path = `${Env.GetDesktopPath()}/临时保存目录_${Date.now()}`;
        if (!FileSystem.existsSync(Folder_path)) FileSystem.mkdirSync(Folder_path);
        
        for (let i = 1; i <= shapes.Count; i++) {
            let shape = shapes.Item(i);
            let cell = shape.TopLeftCell;
            let row = cell.Row;
            let col = cell.Column;
            let relative_row = row - startRow + 1;
            let relative_col = col - startCol + 1;
            if (shape.Type == 13 && row >= startRow && row <= endRow && col >= startCol && col <= endCol) {
                if (relative_row >= 1 && relative_row <= allData.length && relative_col >= 1 && relative_col <= allData[0].length) {
                    allData[relative_row - 1][relative_col - 1] = shape.Name;
                }
            }
        }
        
        let ws = ap.ActiveSheet;
        for (let i = 1; i <= rowCount; i++) {
            let actualRow = startRow + i - 1;
            if (!ws.Rows(actualRow).Hidden) {
                visibleRowIndices.push(i - 1);
            }
        }
        
        for (let j = 1; j <= colCount; j++) {
            let actualCol = startCol + j - 1;
            if (!ws.Columns(actualCol).Hidden) {
                visibleColIndices.push(j - 1);
            }
        }
        
        const visibleData = visibleRowIndices.map(rowIdx => 
            visibleColIndices.map(colIdx => allData[rowIdx][colIdx])
        );
        
        return [visibleData, Folder_path];
    }
    
    function isWordFile(filePath) {
        var wordExtensions = [
            '.doc', '.docx', '.dot', '.dotx', '.docm', '.dotm', '.wll', '.wiz'
        ];
        var extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
        return wordExtensions.includes(extension);
    }
    
    function findAndRemoveImages(imageArray, searchStr) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        const foundImages = [];
        for (let i = imageArray.length - 1; i >= 0; i--) {
            const imagePath = imageArray[i];
            if (typeof imagePath !== 'string') continue;
            const isImage = imageExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));
            if (!isImage) continue;
            const fileName = imagePath.split(/[\\/]/).pop();
            const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
            if (fileNameWithoutExt === searchStr || fileNameWithoutExt.includes(searchStr)) {
                foundImages.unshift(imagePath);
            }
        }
        return foundImages;
    }
    
    //------------------主函数运行---------------------
    模板自动化word函数最终测试版();
}

//----------------加载项按钮函数--------------------
function Workbook_Open() {
    let bar1 = null;
    let com = Application.CommandBars;
    
    for (let i = 1; i <= com.Count; i++) {
        let currentBar = com(i);
        if (currentBar.Name === "xiaohaike_函数区") {
            bar1 = currentBar;
            break;
        }
    }
    
    if (!bar1) {
        bar1 = Application.CommandBars.Add("xiaohaike_函数区");
    }
    bar1.Visible = true;
    
    let btn1 = bar1.Controls.Add(msoControlButton);
    btn1.Caption = 'xiaohaike_word自动化函数';
    btn1.OnAction = '模板自动化word函数';
}