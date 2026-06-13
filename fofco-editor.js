class FOFcoEditor {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) {
            console.error('FOFcoEditor: Container element not found!');
            return;
        }
        this.init();
    }

    init() {
        this.injectDependencies();
        this.injectCSS();
        this.injectHTML();
        setTimeout(() => {
            this.injectLogic();
        }, 150);
    }

    injectDependencies() {
        const head = document.head;
        const links = [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
            "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        ];
        links.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet'; link.href = href;
                if(href.includes('font-awesome')) link.setAttribute('crossorigin', 'anonymous');
                head.appendChild(link);
            }
        });

        if (!document.querySelector('script[src*="katex.min.js"]')) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js";
            script.defer = true;
            head.appendChild(script);
        }
    }

    injectCSS() {
        if (document.getElementById('fofco-exact-styles')) return;
        const style = document.createElement('style');
        style.id = 'fofco-exact-styles';
        // এখানে তোমার fofco-editor.html এর 100% হুবহু CSS ব্যবহার করা হয়েছে
        // শুধু তোমার মেইন সাইট যাতে না ভাঙে, তাই সব ক্লাসের আগে .fofco-wrapper বসিয়েছি।
        style.innerHTML = `
            .fofco-wrapper {
                --primary: #2563eb;
                --bg-editor: #ffffff;
                --border: #e2e8f0;
                --text-main: #1e293b;
                --text-muted: #64748b;
                --hover-bg: #f1f5f9;
                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                font-family: "Inter", sans-serif;
                color: var(--text-main);
                position: relative;
            }

            /* 🔥 FIX: FontAwesome আইকন যাতে না ভাঙে তার জন্য font-family রিমুভ করা হয়েছে */
            .fofco-wrapper * { box-sizing: border-box; }

            .fofco-wrapper .editor-container { max-width: 1100px; margin: 0 auto; background: var(--bg-editor); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; position: relative; }
            .fofco-wrapper .toolbar { padding: 12px 16px; background: #ffffff; border-bottom: 1px solid var(--border); border-radius: 12px 12px 0 0; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; position: sticky; top: 0; z-index: 10; }
            .fofco-wrapper .divider { width: 1px; height: 20px; background: var(--border); margin: 0 8px; }
            .fofco-wrapper button.tool-btn { padding: 8px 10px; border: 1px solid transparent; background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-muted); font-size: 14px; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: inherit; }
            .fofco-wrapper button.tool-btn:hover { background: var(--hover-bg); color: var(--text-main); }
            .fofco-wrapper button.tool-btn.active { background: #eff6ff; color: var(--primary); }
            
            .fofco-wrapper .dropdown-wrapper { position: relative; }
            .fofco-wrapper .dropdown-menu { position: absolute; top: calc(100% + 6px); left: 0; background: #fff; border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-lg); display: none; z-index: 100; overflow: hidden; min-width: 100%; }
            .fofco-wrapper .dropdown-wrapper.active .dropdown-menu { display: block; animation: popup 0.15s ease-out; }
            @keyframes popup { from { opacity: 0; transform: translateY(-4px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
            
            .fofco-wrapper .font-search-box { display: flex; padding: 10px; background: #f8fafc; border-bottom: 1px solid var(--border); }
            .fofco-wrapper .font-search-box input { flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; outline: none; font-family: inherit; }
            .fofco-wrapper .font-search-box input:focus { border-color: var(--primary); }
            .fofco-wrapper .font-search-box button { background: var(--primary); color: #fff; padding: 8px 12px; margin-left: 6px; border-radius: 6px; border: none; cursor: pointer; }
            .fofco-wrapper .font-search-box button:hover { background: #1d4ed8; }
            
            .fofco-wrapper .font-section { font-size: 11px; font-weight: 600; color: var(--text-muted); padding: 10px 12px 6px; background: #fff; text-transform: uppercase; letter-spacing: 0.5px; }
            .fofco-wrapper .font-list { max-height: 220px; overflow-y: auto; width: 280px; padding-bottom: 8px; }
            .fofco-wrapper .font-item { padding: 10px 16px; cursor: pointer; transition: background 0.15s; font-size: 14px; }
            .fofco-wrapper .font-item:hover { background: var(--hover-bg); color: var(--primary); }
            
            .fofco-wrapper .list-menu { min-width: 160px; padding: 6px; }
            .fofco-wrapper .list-menu button { width: 100%; justify-content: flex-start; padding: 8px 12px; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); font-size: 14px; font-family: inherit; }
            .fofco-wrapper .list-menu button:hover { background: var(--hover-bg); color: var(--text-main); }
            
            .fofco-wrapper .font-size-control { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 6px; background: #fff; height: 32px; overflow: hidden; transition: border-color 0.2s; }
            .fofco-wrapper .font-size-control:focus-within { border-color: var(--primary); }
            .fofco-wrapper .font-size-control button { border: none; background: transparent; padding: 0 10px; height: 100%; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
            .fofco-wrapper .font-size-control button:hover { background: var(--hover-bg); color: var(--text-main); }
            .fofco-wrapper .font-size-control input { width: 40px; text-align: center; border: none; border-left: 1px solid var(--border); border-right: 1px solid var(--border); background: transparent; height: 100%; outline: none; font-family: inherit; font-size: 14px; font-weight: 500; color: var(--text-main); -moz-appearance: textfield; }
            .fofco-wrapper .font-size-control input::-webkit-outer-spin-button, .fofco-wrapper .font-size-control input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            
            .fofco-wrapper .color-panel { padding: 12px; min-width: 190px; }
            .fofco-wrapper .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 10px; }
            .fofco-wrapper .color-btn { width: 26px; height: 26px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(0, 0, 0, 0.08); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; transition: all 0.15s; }
            .fofco-wrapper .color-btn:hover { transform: scale(1.15); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-color: rgba(0, 0, 0, 0.15); }
            
            .fofco-wrapper .color-action-btn { width: 100%; padding: 8px; background: #f8fafc; border: 1px solid var(--border); border-radius: 6px; color: #475569; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px; transition: 0.2s; border: none;}
            .fofco-wrapper .color-action-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
            .fofco-wrapper .native-color-picker { opacity: 0; position: absolute; width: 0; height: 0; pointer-events: none; }
            
            .fofco-wrapper .editor-area { min-height: 550px; padding: 40px 60px; outline: none; line-height: 1.7; font-size: 16px; overflow-y: auto; color: #1e293b; }
            .fofco-wrapper .editor-area ul, .fofco-wrapper .editor-area ol { margin-left: 35px !important; padding-left: 5px !important; margin-bottom: 1em; }
            .fofco-wrapper .editor-area li { margin-bottom: 8px; }
            .fofco-wrapper .editor-area h1, .fofco-wrapper .editor-area h2, .fofco-wrapper .editor-area h3, .fofco-wrapper .editor-area h4 { font-weight: 600; color: #0f172a; margin: 1.2em 0 0.5em 0; }
            .fofco-wrapper .editor-area blockquote { border-left: 4px solid var(--primary); padding-left: 16px; margin: 16px 0; font-style: italic; color: #475569; background: #f8fafc; padding-top: 12px; padding-bottom: 12px; border-radius: 0 8px 8px 0; }
            .fofco-wrapper .editor-area pre { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; margin: 16px 0; }
            .fofco-wrapper .editor-area.drag-over { background: #f0fdf4; border: 2px dashed #4ade80; border-radius: 12px; }
            .fofco-wrapper .editor-area img { max-width: 100%; cursor: pointer; user-select: none; border-radius: 6px; }
            .fofco-wrapper .editor-area img.selected { outline: 3px solid var(--primary); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
            
            .fofco-wrapper .img-toolbar { position: absolute; display: none; background: #1e293b; padding: 6px; border-radius: 8px; box-shadow: var(--shadow-lg); z-index: 50; gap: 4px; }
            .fofco-wrapper .img-toolbar button { border: none; background: transparent; cursor: pointer; color: #f8fafc; padding: 6px 8px; border-radius: 4px; }
            .fofco-wrapper .img-toolbar button:hover { background: #334155; color: #fff; }
            .fofco-wrapper .img-resizer { position: absolute; width: 14px; height: 14px; background: var(--primary); border: 2px solid #fff; border-radius: 50%; cursor: nwse-resize; z-index: 60; display: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
            
            .fofco-wrapper .latex-node { cursor: pointer; padding: 2px 6px; border-radius: 4px; border: 1px solid transparent; transition: border 0.2s; }
            .fofco-wrapper .latex-node:hover { border-color: var(--primary); background: #f8fafc; }
            .fofco-wrapper .inline-math { display: inline-block; vertical-align: middle; margin: 0 2px; }
            .fofco-wrapper .block-math { display: block; text-align: center; margin: 20px 0; width: 100%; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--border); }
            
            .fofco-wrapper .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.5); display: none; justify-content: center; align-items: center; z-index: 999; backdrop-filter: blur(4px); }
            .fofco-wrapper .modal-overlay.active { display: flex; animation: fadeIn 0.2s; }
            .fofco-wrapper .modal-box { background: #fff; padding: 30px; border-radius: 16px; box-shadow: var(--shadow-lg); width: 420px; }
            .fofco-wrapper .modal-box h3 { margin-bottom: 20px; font-size: 18px; color: #0f172a; font-weight: 600; }
            .fofco-editor-wrapper .modal-box input[type="text"] { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; outline: none; font-family: inherit; }
            .fofco-wrapper .modal-box input[type="text"]:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
            .fofco-wrapper .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
            .fofco-wrapper .btn-primary { background: var(--primary); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer; font-family: inherit;}
            .fofco-wrapper .btn-primary:hover { background: #1d4ed8; color: #fff; }
            .fofco-wrapper .btn-danger { background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer; font-family: inherit;}
            .fofco-wrapper .btn-danger:hover { background: #dc2626; color: #fff; }
            .fofco-wrapper .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer; font-family: inherit;}
            .fofco-wrapper .btn-secondary:hover { background: #e2e8f0; }
            .fofco-wrapper .modal-dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; text-align: center; margin-bottom: 20px; background: #f8fafc; cursor: pointer; transition: 0.2s; }
            .fofco-wrapper .modal-dropzone:hover, .fofco-wrapper .modal-dropzone.drag-over { border-color: var(--primary); background: #eff6ff; }
            .fofco-wrapper .modal-dropzone i { font-size: 32px; color: #94a3b8; margin-bottom: 12px; }
            .fofco-wrapper #modal-file-input { display: none; }
        `;
        document.head.appendChild(style);
    }

    injectHTML() {
        // তোমার আপলোড করা fofco-editor.html ফাইলের 100% হুবহু HTML কোড
        this.container.innerHTML = `
        <div class="fofco-wrapper">
            <div class="modal-overlay" id="link-modal">
              <div class="modal-box">
                <h3>Insert/Edit Link</h3>
                <input type="text" id="link-url-input" placeholder="https://example.com" />
                <div class="modal-actions">
                  <button class="btn-danger" onclick="ModalManager.removeLink()">Remove</button>
                  <button class="btn-secondary" onclick="ModalManager.close('link-modal')">Cancel</button>
                  <button class="btn-primary" onclick="ModalManager.applyLink()">Apply Link</button>
                </div>
              </div>
            </div>

            <div class="modal-overlay" id="media-modal">
              <div class="modal-box">
                <h3>Insert Media</h3>
                <input type="text" id="media-url-input" placeholder="Image or Video URL..." />
                <div style="text-align: center; margin-bottom: 15px; color: var(--text-muted); font-size: 13px; font-weight: 500;">OR</div>
                <div class="modal-dropzone" id="media-dropzone" onclick="document.getElementById('modal-file-input').click()">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Drag & Drop here or <b>Browse Files</b></p>
                  <input type="file" id="modal-file-input" accept="image/*,video/*" onchange="ModalManager.handleFileInput(event)" />
                </div>
                <div class="modal-actions">
                  <button class="btn-secondary" onclick="ModalManager.close('media-modal')">Cancel</button>
                  <button class="btn-primary" onclick="ModalManager.applyMediaUrl()">Insert</button>
                </div>
              </div>
            </div>

            <div class="editor-container">
              <div id="img-toolbar" class="img-toolbar">
                <button onmousedown="event.preventDefault()" onclick="ImgManager.align('left')" title="Wrap Left"><i class="fas fa-align-left"></i></button>
                <button onmousedown="event.preventDefault()" onclick="ImgManager.align('none')" title="Center (No Wrap)"><i class="fas fa-align-center"></i></button>
                <button onmousedown="event.preventDefault()" onclick="ImgManager.align('right')" title="Wrap Right"><i class="fas fa-align-right"></i></button>
              </div>
              <div id="img-resizer" class="img-resizer"></div>

              <div class="toolbar">
                <div class="dropdown-wrapper" id="font-dropdown">
                  <button class="tool-btn" onmousedown="event.preventDefault()" onclick="toggleDropdown('font-dropdown')" style="width: 140px; justify-content: space-between; border: 1px solid var(--border);">
                    <span id="active-font">Roboto</span>
                    <i class="fas fa-chevron-down" style="font-size: 12px"></i>
                  </button>
                  <div class="dropdown-menu">
                    <div class="font-search-box">
                      <input type="text" id="font-input" placeholder="Search Font..." onkeypress="if (event.key === 'Enter') FontManager.fetchFont();" />
                      <button onmousedown="event.preventDefault()" onclick="FontManager.fetchFont()"><i class="fas fa-search"></i></button>
                    </div>
                    <div class="font-section">Recent Fonts</div>
                    <div class="font-list" id="recent-fonts"></div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="font-size-control">
                  <button onmousedown="event.preventDefault()" onclick="changeFontSize(-1)" title="Decrease font size"><i class="fas fa-minus" style="font-size: 10px"></i></button>
                  <input type="number" id="font-size-input" value="16" min="1" max="200" onchange="applyDirectFontSize(this.value)" onmousedown="event.stopPropagation()" onkeydown="if (event.key === 'Enter') { event.preventDefault(); applyDirectFontSize(this.value); editor.focus(); }" title="Font Size" />
                  <button onmousedown="event.preventDefault()" onclick="changeFontSize(1)" title="Increase font size"><i class="fas fa-plus" style="font-size: 10px"></i></button>
                </div>

                <div class="divider"></div>

                <div class="dropdown-wrapper" id="format-dropdown">
                  <button class="tool-btn" onmousedown="event.preventDefault()" onclick="toggleDropdown('format-dropdown')" style="width: 125px; justify-content: space-between">
                    <span id="active-format">Paragraph</span>
                    <i class="fas fa-chevron-down" style="font-size: 12px"></i>
                  </button>
                  <div class="dropdown-menu list-menu">
                    <button onmousedown="event.preventDefault()" onclick="applyFormat('P', 'Paragraph')">Paragraph</button>
                    <button onmousedown="event.preventDefault()" onclick="applyFormat('H1', 'Heading 1')" style="font-size: 22px; font-weight: 600">Heading 1</button>
                    <button onmousedown="event.preventDefault()" onclick="applyFormat('H2', 'Heading 2')" style="font-size: 18px; font-weight: 600">Heading 2</button>
                    <button onmousedown="event.preventDefault()" onclick="applyFormat('H3', 'Heading 3')" style="font-size: 16px; font-weight: 600">Heading 3</button>
                  </div>
                </div>

                <div class="divider"></div>

                <button class="tool-btn" id="btn-bold" onmousedown="event.preventDefault()" onclick="formatDoc('bold')" title="Bold"><i class="fas fa-bold"></i></button>
                <button class="tool-btn" id="btn-italic" onmousedown="event.preventDefault()" onclick="formatDoc('italic')" title="Italic"><i class="fas fa-italic"></i></button>
                <button class="tool-btn" id="btn-underline" onmousedown="event.preventDefault()" onclick="formatDoc('underline')" title="Underline"><i class="fas fa-underline"></i></button>
                <button class="tool-btn" id="btn-strikeThrough" onmousedown="event.preventDefault()" onclick="formatDoc('strikeThrough')" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="applyOverline()" title="Aboveline"><i class="fas fa-overline"></i>A&#773;</button>

                <div class="divider"></div>

                <div class="dropdown-wrapper" id="color-dropdown">
                  <button class="tool-btn" onmousedown="event.preventDefault()" onclick="toggleDropdown('color-dropdown')" title="Text Color">
                    <i class="fas fa-font" id="color-icon"></i>
                    <i class="fas fa-caret-down" style="font-size: 12px"></i>
                  </button>
                  <div class="dropdown-menu color-panel">
                    <div class="color-grid">
                      <div class="color-btn" style="background: #000000" onmousedown="event.preventDefault()" onclick="applyTextColor('#000000')"></div>
                      <div class="color-btn" style="background: #475569" onmousedown="event.preventDefault()" onclick="applyTextColor('#475569')"></div>
                      <div class="color-btn" style="background: #ef4444" onmousedown="event.preventDefault()" onclick="applyTextColor('#ef4444')"></div>
                      <div class="color-btn" style="background: #f97316" onmousedown="event.preventDefault()" onclick="applyTextColor('#f97316')"></div>
                      <div class="color-btn" style="background: #eab308" onmousedown="event.preventDefault()" onclick="applyTextColor('#eab308')"></div>
                      <div class="color-btn" style="background: #22c55e" onmousedown="event.preventDefault()" onclick="applyTextColor('#22c55e')"></div>
                      <div class="color-btn" style="background: #06b6d4" onmousedown="event.preventDefault()" onclick="applyTextColor('#06b6d4')"></div>
                      <div class="color-btn" style="background: #3b82f6" onmousedown="event.preventDefault()" onclick="applyTextColor('#3b82f6')"></div>
                      <div class="color-btn" style="background: #8b5cf6" onmousedown="event.preventDefault()" onclick="applyTextColor('#8b5cf6')"></div>
                      <div class="color-btn" style="background: #ec4899" onmousedown="event.preventDefault()" onclick="applyTextColor('#ec4899')"></div>
                    </div>
                    <button class="color-action-btn" onmousedown="event.preventDefault()" onclick="document.getElementById('native-color-input').click()">
                      <i class="fas fa-palette"></i> Custom Color
                    </button>
                    <input type="color" id="native-color-input" class="native-color-picker" onchange="applyTextColor(this.value)" />
                  </div>
                </div>

                <div class="dropdown-wrapper" id="hl-dropdown">
                  <button class="tool-btn" onmousedown="event.preventDefault()" onclick="toggleDropdown('hl-dropdown')" title="Highlighter">
                    <i class="fas fa-highlighter" id="hl-icon"></i>
                    <i class="fas fa-caret-down" style="font-size: 12px"></i>
                  </button>
                  <div class="dropdown-menu color-panel">
                    <div class="color-grid">
                      <div class="color-btn" style="background: #ff9fae" onmousedown="event.preventDefault()" onclick="applyHighlight('#ff9fae')" title="Pink"></div>
                      <div class="color-btn" style="background: #fde995" onmousedown="event.preventDefault()" onclick="applyHighlight('#fde995')" title="Yellow"></div>
                      <div class="color-btn" style="background: #a6e1c5" onmousedown="event.preventDefault()" onclick="applyHighlight('#a6e1c5')" title="Green"></div>
                      <div class="color-btn" style="background: #a7e0f6" onmousedown="event.preventDefault()" onclick="applyHighlight('#a7e0f6')" title="Blue"></div>
                      <div class="color-btn" style="background: #e1a7fb" onmousedown="event.preventDefault()" onclick="applyHighlight('#e1a7fb')" title="Purple"></div>
                    </div>
                    <button class="color-action-btn" onmousedown="event.preventDefault()" onclick="applyHighlight('transparent')">
                      <i class="fas fa-eraser"></i> Clear Highlight
                    </button>
                  </div>
                </div>

                <div class="divider"></div>

                <button class="tool-btn" id="btn-justifyLeft" onmousedown="event.preventDefault()" onclick="formatDoc('justifyLeft')"><i class="fas fa-align-left"></i></button>
                <button class="tool-btn" id="btn-justifyCenter" onmousedown="event.preventDefault()" onclick="formatDoc('justifyCenter')"><i class="fas fa-align-center"></i></button>
                <button class="tool-btn" id="btn-justifyRight" onmousedown="event.preventDefault()" onclick="formatDoc('justifyRight')"><i class="fas fa-align-right"></i></button>

                <div class="divider"></div>

                <button class="tool-btn" id="btn-insertOrderedList" onmousedown="event.preventDefault()" onclick="formatDoc('insertOrderedList')" title="Ordered List"><i class="fas fa-list-ol"></i></button>
                <div class="dropdown-wrapper" id="list-dropdown">
                  <button class="tool-btn" onmousedown="event.preventDefault()" onclick="toggleDropdown('list-dropdown')" title="Unordered List Types">
                    <i class="fas fa-list-ul"></i>
                    <i class="fas fa-caret-down" style="font-size: 12px"></i>
                  </button>
                  <div class="dropdown-menu list-menu">
                    <button onmousedown="event.preventDefault()" onclick="applyListStyle('disc')">&bull; Disc</button>
                    <button onmousedown="event.preventDefault()" onclick="applyListStyle('circle')">&#9675; Circle</button>
                    <button onmousedown="event.preventDefault()" onclick="applyListStyle('square')">&#9632; Square</button>
                  </div>
                </div>

                <div class="divider"></div>

                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="ModalManager.openLink()" title="Link"><i class="fas fa-link"></i></button>
                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="ModalManager.openMedia()" title="Image/Video"><i class="fas fa-image"></i></button>

                <div class="divider"></div>

                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="formatDoc('formatBlock', 'BLOCKQUOTE')" title="Quote"><i class="fas fa-quote-right"></i></button>
                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="insertCode()" title="Code Block"><i class="fas fa-code"></i></button>
                <button class="tool-btn" onmousedown="event.preventDefault()" onclick="formatDoc('removeFormat')" title="Clear Format"><i class="fas fa-eraser"></i></button>
              </div>

              <div id="editor" class="editor-area" contenteditable="true" spellcheck="false"placeholder= "type here...">
              </div>
            </div>
        </div>
        `;
    }

    injectLogic() {
        // ফন্ট এবং ডিজাইনের লজিক যাতে ভেঙে না যায়, তাই 100% হুবহু তোমার ফাইলের JS এখানে ডাইরেক্ট ইমপ্লিমেন্ট করা হয়েছে
        if (document.getElementById('fofco-logic-script')) return;
        const script = document.createElement('script');
        script.id = 'fofco-logic-script';
        script.innerHTML = `
            window.editor = document.getElementById("editor");
            window.savedSelection = null;

            window.saveSelection = function() {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) window.savedSelection = sel.getRangeAt(0);
            }

            window.restoreSelection = function() {
                if (window.savedSelection) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(window.savedSelection);
                }
            }

            window.ModalManager = {
                openLink() { saveSelection(); document.getElementById("link-url-input").value = ""; document.getElementById("link-modal").classList.add("active"); setTimeout(() => document.getElementById("link-url-input").focus(), 100); },
                applyLink() { restoreSelection(); const url = document.getElementById("link-url-input").value.trim(); if (url) formatDoc("createLink", url); this.close("link-modal"); },
                removeLink() { restoreSelection(); formatDoc("unlink"); this.close("link-modal"); },
                openMedia() { saveSelection(); document.getElementById("media-url-input").value = ""; document.getElementById("media-modal").classList.add("active"); },
                applyMediaUrl() { restoreSelection(); const url = document.getElementById("media-url-input").value.trim(); if (url) formatDoc("insertHTML", \`<img src="\${url}" alt="media">\`); this.close("media-modal"); },
                handleFileInput(e) { const file = e.target.files[0]; if (file) this.processFile(file); },
                processFile(file) {
                    restoreSelection(); const reader = new FileReader();
                    reader.onload = (ev) => {
                        const html = file.type.startsWith("image/") ? \`<img src="\${ev.target.result}" alt="local">\` : \`<video controls style="max-width:100%; border-radius: 8px;"><source src="\${ev.target.result}"></video>\`;
                        formatDoc("insertHTML", html); this.close("media-modal");
                    };
                    reader.readAsDataURL(file);
                },
                close(id) { document.getElementById(id).classList.remove("active"); window.editor.focus(); }
            };

            const mDropzone = document.getElementById("media-dropzone");
            mDropzone.addEventListener("dragover", (e) => { e.preventDefault(); mDropzone.classList.add("drag-over"); });
            mDropzone.addEventListener("dragleave", () => mDropzone.classList.remove("drag-over"));
            mDropzone.addEventListener("drop", (e) => { e.preventDefault(); mDropzone.classList.remove("drag-over"); if (e.dataTransfer.files[0]) window.ModalManager.processFile(e.dataTransfer.files[0]); });

            window.editor.addEventListener("dragover", (e) => { e.preventDefault(); window.editor.classList.add("drag-over"); });
            window.editor.addEventListener("dragleave", () => window.editor.classList.remove("drag-over"));
            window.editor.addEventListener("drop", (e) => {
                e.preventDefault(); window.editor.classList.remove("drag-over");
                const file = e.dataTransfer.files[0];
                if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
                    let range;
                    if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(e.clientX, e.clientY);
                    else if (e.rangeParent) { range = document.createRange(); range.setStart(e.rangeParent, e.rangeOffset); }
                    const sel = window.getSelection(); sel.removeAllRanges(); if (range) sel.addRange(range);
                    saveSelection(); window.ModalManager.processFile(file);
                }
            });

            window.formatDoc = function(cmd, value = null) { document.execCommand(cmd, false, value); window.editor.focus(); window.updateActiveStates(); }
            window.applyFormat = function(tag, name) { formatDoc("formatBlock", tag); document.getElementById("active-format").innerText = name; closeAllDropdowns(); }
            window.applyDirectFontSize = function(px) {
                if (!px) return; saveSelection(); restoreSelection();
                document.execCommand("fontSize", false, "7");
                const fonts = window.editor.querySelectorAll('font[size="7"]');
                fonts.forEach((f) => { f.removeAttribute("size"); f.style.fontSize = px + "px"; });
            }
            window.changeFontSize = function(delta) {
                const input = document.getElementById("font-size-input");
                let currentSize = parseInt(input.value) || 16; let newSize = currentSize + delta; if (newSize < 1) newSize = 1;
                input.value = newSize; applyDirectFontSize(newSize);
            }
            window.applyTextColor = function(color) { formatDoc("foreColor", color); document.getElementById("color-icon").style.color = color; closeAllDropdowns(); }
            window.applyHighlight = function(color) {
                if (color === "transparent") { document.execCommand("backColor", false, "rgba(0,0,0,0)"); document.getElementById("hl-icon").style.color = "var(--text-muted)"; } 
                else { document.execCommand("backColor", false, color); document.getElementById("hl-icon").style.color = color; }
                closeAllDropdowns();
            }
            window.applyOverline = function() {
                const sel = window.getSelection(); if (!sel.rangeCount) return;
                const span = document.createElement("span"); span.style.textDecoration = "overline";
                sel.getRangeAt(0).surroundContents(span);
            }
            window.applyListStyle = function(type) {
                formatDoc("insertUnorderedList"); const sel = window.getSelection(); let node = sel.anchorNode;
                while (node && node.nodeName !== "UL" && node.nodeName !== "DIV") { node = node.parentNode; }
                if (node && node.nodeName === "UL") node.style.listStyleType = type; closeAllDropdowns();
            }
            window.insertCode = function() { formatDoc("insertHTML", \`<pre><code>// your code...</code></pre><p><br></p>\`); }

            const toggleBtns = ["bold", "italic", "underline", "strikeThrough", "justifyLeft", "justifyCenter", "justifyRight", "insertOrderedList"];
            window.updateActiveStates = function() {
                toggleBtns.forEach((cmd) => { const btn = document.getElementById("btn-" + cmd); if (btn) { if (document.queryCommandState(cmd)) btn.classList.add("active"); else btn.classList.remove("active"); } });
                try {
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0 && window.editor.contains(sel.anchorNode)) {
                        let node = sel.anchorNode; let parent = node.nodeType === 3 ? node.parentNode : node;
                        let computedSize = window.getComputedStyle(parent).fontSize;
                        if (computedSize) document.getElementById("font-size-input").value = parseInt(computedSize);
                    }
                } catch (e) {}
            }
            window.editor.addEventListener("keyup", window.updateActiveStates);
            window.editor.addEventListener("mouseup", window.updateActiveStates);

            window.FontManager = {
                loaded: new Set(["Roboto", "Inter"]),
                recent: JSON.parse(localStorage.getItem("editor_fonts")) || ["Roboto", "Open Sans"],
                init() { this.recent.forEach((f) => this.loadCSS(f)); this.renderRecent(); },
                async fetchFont() {
                    let name = document.getElementById("font-input").value.trim(); if (!name) return;
                    name = name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
                    if (this.loaded.has(name) || this.recent.includes(name)) { this.apply(name); return; }
                    try {
                        const url = \`https://fonts.googleapis.com/css2?family=\${name.replace(/ /g, "+")}:wght@400;600&display=swap\`;
                        const res = await fetch(url, { method: "HEAD" });
                        if (res.ok) { this.loadCSS(name, url); this.apply(name); document.getElementById("font-input").value = ""; } 
                        else alert(\`Font "\${name}" not found.\`);
                    } catch (e) { console.error(e); }
                },
                loadCSS(name, url = null) {
                    if (this.loaded.has(name)) return;
                    const link = document.createElement("link"); link.href = url || \`https://fonts.googleapis.com/css2?family=\${name.replace(/ /g, "+")}:wght@400;600&display=swap\`;
                    link.rel = "stylesheet"; document.head.appendChild(link); this.loaded.add(name);
                },
                apply(name) {
                    saveSelection(); restoreSelection(); this.loadCSS(name);
                    document.getElementById("active-font").innerText = name; formatDoc("fontName", name); closeAllDropdowns();
                    if (!this.recent.includes(name)) { this.recent.unshift(name); if (this.recent.length > 8) this.recent.pop(); localStorage.setItem("editor_fonts", JSON.stringify(this.recent)); this.renderRecent(); }
                },
                renderRecent() {
                    const box = document.getElementById("recent-fonts"); box.innerHTML = "";
                    this.recent.forEach((font) => {
                        const div = document.createElement("div"); div.className = "font-item"; div.innerText = font; div.style.fontFamily = font;
                        div.onmouseenter = () => this.loadCSS(font); div.onmousedown = (e) => { e.preventDefault(); this.apply(font); };
                        box.appendChild(div);
                    });
                },
            };

            window.ImgManager = {
                selected: null, toolbar: document.getElementById("img-toolbar"), resizer: document.getElementById("img-resizer"), isDragging: false, startX: 0, startW: 0,
                init() {
                    window.editor.addEventListener("click", (e) => { if (e.target.tagName === "IMG") this.select(e.target); else this.deselect(); });
                    this.resizer.addEventListener("mousedown", (e) => { this.isDragging = true; this.startX = e.clientX; this.startW = this.selected.clientWidth; e.preventDefault(); });
                    document.addEventListener("mousemove", (e) => { if (!this.isDragging || !this.selected) return; const deltaX = e.clientX - this.startX; this.selected.style.width = this.startW + deltaX + "px"; this.updateOverlays(); });
                    document.addEventListener("mouseup", () => { this.isDragging = false; });
                    window.editor.addEventListener("scroll", () => this.updateOverlays());
                },
                select(img) { this.deselect(); this.selected = img; this.selected.classList.add("selected"); this.updateOverlays(); },
                updateOverlays() {
                    if (!this.selected) return;
                    const containerRect = document.querySelector(".editor-container").getBoundingClientRect();
                    const rect = this.selected.getBoundingClientRect();
                    this.toolbar.style.display = "flex"; this.toolbar.style.top = rect.top - containerRect.top - 40 + "px"; this.toolbar.style.left = rect.left - containerRect.left + 10 + "px";
                    this.resizer.style.display = "block"; this.resizer.style.top = rect.bottom - containerRect.top - 7 + "px"; this.resizer.style.left = rect.right - containerRect.left - 7 + "px";
                },
                deselect() { if (this.selected) this.selected.classList.remove("selected"); this.selected = null; this.toolbar.style.display = "none"; this.resizer.style.display = "none"; },
                align(type) {
                    if (!this.selected) return;
                    this.selected.style.display = type === "none" ? "block" : "inline-block"; this.selected.style.float = type;
                    this.selected.style.margin = type === "none" ? "15px auto" : type === "left" ? "0 15px 15px 0" : "0 0 15px 15px";
                    setTimeout(() => this.updateOverlays(), 10);
                },
            };

            window.LatexEngine = {
                init() {
                    window.editor.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") this.renderSafely(); });
                    window.editor.addEventListener("dblclick", (e) => {
                        const node = e.target.closest(".latex-node");
                        if (node) {
                            const tex = node.getAttribute("data-tex"); const isBlock = node.classList.contains("block-math");
                            const raw = document.createTextNode(isBlock ? \`$$ \${tex} $$\` : \`$ \${tex} $\`);
                            node.parentNode.replaceChild(raw, node);
                        }
                    });
                },
                renderSafely() {
                    if (typeof katex === "undefined") return;
                    const sel = window.getSelection(); if (!sel.rangeCount) return;
                    const range = sel.getRangeAt(0);
                    const marker = document.createElement("span"); const markerId = "caret-" + Math.random().toString(36).substr(2, 9); marker.id = markerId;
                    range.insertNode(marker);
                    let content = window.editor.innerHTML;
                    content = content.replace(/(?<!\$)\$\$([^\$]+?)\$\$(?!\$)/g, (match, tex) => { if (tex.includes(markerId)) return match; return this.compile(tex, true) || match; });
                    content = content.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (match, tex) => { if (tex.includes(markerId)) return match; return this.compile(tex, false) || match; });
                    window.editor.innerHTML = content;
                    const restoredMarker = document.getElementById(markerId);
                    if (restoredMarker) { const newRange = document.createRange(); newRange.setStartAfter(restoredMarker); newRange.collapse(true); sel.removeAllRanges(); sel.addRange(newRange); restoredMarker.remove(); }
                },
                compile(tex, display) {
                    try {
                        let cleanTex = tex.replace(/<span id="caret-.*?"><\\/span>/g, "").trim();
                        const html = katex.renderToString(cleanTex, { displayMode: display, throwOnError: false });
                        const modeClass = display ? "block-math" : "inline-math";
                        return \`<span class="latex-node \${modeClass}" contenteditable="false" data-tex="\${cleanTex}">\${html}</span>\`;
                    } catch (e) { return null; }
                },
            };

            window.editor.addEventListener("paste", (e) => {
                e.preventDefault(); const text = (e.originalEvent || e).clipboardData.getData("text/plain");
                document.execCommand("insertHTML", false, text.replace(/\\n/g, "<br>"));
            });

            window.closeAllDropdowns = function() { document.querySelectorAll(".dropdown-wrapper").forEach((el) => el.classList.remove("active")); }
            window.toggleDropdown = function(id) { const target = document.getElementById(id); const isActive = target.classList.contains("active"); window.closeAllDropdowns(); if (!isActive) target.classList.add("active"); }

            document.addEventListener("mousedown", (e) => { if (!e.target.closest(".dropdown-wrapper") && !e.target.closest(".font-size-control")) { window.closeAllDropdowns(); } });

            // Initialize Everything safely
            window.FontManager.init();
            window.ImgManager.init();
            window.LatexEngine.init();
        `;
        document.body.appendChild(script);
    }
}

// Global Export
window.FOFcoEditor = FOFcoEditor;
