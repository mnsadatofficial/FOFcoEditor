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
        
        // DOM লোড হওয়ার জন্য একটু সময় দেওয়া হচ্ছে
        setTimeout(() => {
            this.initLogic();
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
                link.rel = 'stylesheet'; 
                link.href = href;
                // আইকন ফাস্ট লোড হওয়ার জন্য
                if(href.includes('font-awesome')) {
                    link.setAttribute('crossorigin', 'anonymous');
                }
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
        // আগের 100% হুবহু প্রিমিয়াম CSS
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
                font-family: 'Inter', sans-serif;
                color: var(--text-main);
                position: relative;
            }
            .fofco-wrapper * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
            
            .fofco-wrapper .editor-container {
                width: 100%;
                background: var(--bg-editor);
                border: 1px solid var(--border);
                border-radius: 12px;
                box-shadow: var(--shadow-md);
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .fofco-wrapper .toolbar {
                padding: 12px 16px;
                background: #ffffff;
                border-bottom: 1px solid var(--border);
                border-radius: 12px 12px 0 0;
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .fofco-wrapper .divider { width: 1px; height: 20px; background: var(--border); margin: 0 8px; }

            .fofco-wrapper button.tool-btn {
                padding: 8px 10px;
                border: 1px solid transparent;
                background: transparent;
                border-radius: 6px;
                cursor: pointer;
                color: var(--text-muted);
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }

            .fofco-wrapper button.tool-btn:hover { background: var(--hover-bg); color: var(--text-main); }
            .fofco-wrapper button.tool-btn.active { background: #eff6ff; color: var(--primary); }

            .fofco-wrapper .dropdown-wrapper { position: relative; }
            .fofco-wrapper .dropdown-menu {
                position: absolute; top: calc(100% + 6px); left: 0; background: #fff;
                border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-lg);
                display: none; z-index: 100; overflow: hidden; min-width: 100%;
            }
            .fofco-wrapper .dropdown-wrapper.active .dropdown-menu { display: block; animation: fofcoPopup 0.15s ease-out; }
            
            @keyframes fofcoPopup {
                from { opacity: 0; transform: translateY(-4px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            .fofco-wrapper .font-search-box { display: flex; padding: 10px; background: #f8fafc; border-bottom: 1px solid var(--border); }
            .fofco-wrapper .font-search-box input { flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; outline: none; }
            .fofco-wrapper .font-search-box input:focus { border-color: var(--primary); }
            .fofco-wrapper .font-search-box button { background: var(--primary); color: #fff; padding: 8px 12px; margin-left: 6px; border-radius: 6px; border: none; cursor: pointer;}
            .fofco-wrapper .font-search-box button:hover { background: #1d4ed8; }
            
            .fofco-wrapper .font-section { font-size: 11px; font-weight: 600; color: var(--text-muted); padding: 10px 12px 6px; background: #fff; text-transform: uppercase; letter-spacing: 0.5px;}
            .fofco-wrapper .font-list { max-height: 220px; overflow-y: auto; width: 280px; padding-bottom: 8px;}
            .fofco-wrapper .font-item { padding: 10px 16px; cursor: pointer; transition: background 0.15s; font-size: 14px;}
            .fofco-wrapper .font-item:hover { background: var(--hover-bg); color: var(--primary); }

            .fofco-wrapper .list-menu { min-width: 160px; padding: 6px; }
            .fofco-wrapper .list-menu button { width: 100%; justify-content: flex-start; padding: 8px 12px; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); font-size: 14px;}
            .fofco-wrapper .list-menu button:hover { background: var(--hover-bg); color: var(--text-main);}

            .fofco-wrapper .font-size-control {
                display: flex; align-items: center; border: 1px solid var(--border); border-radius: 6px; background: #fff; height: 32px; overflow: hidden; transition: border-color 0.2s;
            }
            .fofco-wrapper .font-size-control:focus-within { border-color: var(--primary); }
            .fofco-wrapper .font-size-control button { border: none; background: transparent; padding: 0 10px; height: 100%; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
            .fofco-wrapper .font-size-control button:hover { background: var(--hover-bg); color: var(--text-main); }
            .fofco-wrapper .font-size-control input {
                width: 40px; text-align: center; border: none; border-left: 1px solid var(--border); border-right: 1px solid var(--border);
                background: transparent; height: 100%; outline: none; font-size: 14px; font-weight: 500; color: var(--text-main); -moz-appearance: textfield;
            }
            .fofco-wrapper .font-size-control input::-webkit-outer-spin-button, .fofco-wrapper .font-size-control input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

            .fofco-wrapper .color-panel { padding: 12px; min-width: 190px; }
            .fofco-wrapper .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 10px;}
            .fofco-wrapper .color-btn { width: 26px; height: 26px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; transition: all 0.15s; }
            .fofco-wrapper .color-btn:hover { transform: scale(1.15); box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-color: rgba(0,0,0,0.15);}
            .fofco-wrapper .color-action-btn { width: 100%; padding: 8px; background: #f8fafc; border: 1px solid var(--border); border-radius: 6px; color: #475569; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px; transition: 0.2s;}
            .fofco-wrapper .color-action-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1;}
            .fofco-wrapper .native-color-picker { opacity: 0; position: absolute; width: 0; height: 0; pointer-events: none;}

            .fofco-wrapper .editor-area {
                min-height: 400px; padding: 40px 60px; outline: none; line-height: 1.7; font-size: 16px; overflow-y: auto; color: #1e293b;
            }
            .fofco-wrapper .editor-area ul, .fofco-wrapper .editor-area ol { margin-left: 35px !important; padding-left: 5px !important; margin-bottom: 1em;}
            .fofco-wrapper .editor-area li { margin-bottom: 8px; }
            .fofco-wrapper .editor-area h1, .fofco-wrapper .editor-area h2, .fofco-wrapper .editor-area h3, .fofco-wrapper .editor-area h4 { font-weight: 600; color: #0f172a; margin: 1.2em 0 0.5em 0; }
            .fofco-wrapper .editor-area blockquote { border-left: 4px solid var(--primary); padding-left: 16px; margin: 16px 0; font-style: italic; color: #475569; background: #f8fafc; padding-top: 12px; padding-bottom: 12px; border-radius: 0 8px 8px 0;}
            .fofco-wrapper .editor-area pre { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; margin: 16px 0; }
            .fofco-wrapper .editor-area.drag-over { background: #f0fdf4; border: 2px dashed #4ade80; border-radius: 12px; }
            .fofco-wrapper .editor-area img { max-width: 100%; cursor: pointer; user-select: none; border-radius: 6px; }
            .fofco-wrapper .editor-area img.selected { outline: 3px solid var(--primary); box-shadow: 0 4px 12px rgba(37,99,235,0.2);}
            
            .fofco-wrapper .img-toolbar { position: absolute; display: none; background: #1e293b; padding: 6px; border-radius: 8px; box-shadow: var(--shadow-lg); z-index: 50; gap: 4px; }
            .fofco-wrapper .img-toolbar button { border: none; background: transparent; cursor: pointer; color: #f8fafc; padding: 6px 8px; border-radius: 4px;}
            .fofco-wrapper .img-toolbar button:hover { background: #334155; color: #fff; }
            .fofco-wrapper .img-resizer { position: absolute; width: 14px; height: 14px; background: var(--primary); border: 2px solid #fff; border-radius: 50%; cursor: nwse-resize; z-index: 60; display: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            
            .fofco-wrapper .latex-node { cursor: pointer; padding: 2px 6px; border-radius: 4px; border: 1px solid transparent; transition: border 0.2s;}
            .fofco-wrapper .latex-node:hover { border-color: var(--primary); background: #f8fafc; }
            .fofco-wrapper .inline-math { display: inline-block; vertical-align: middle; margin: 0 2px; }
            .fofco-wrapper .block-math { display: block; text-align: center; margin: 20px 0; width: 100%; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--border);}

            .fofco-wrapper .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.5); display: none; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(4px); }
            .fofco-wrapper .modal-overlay.active { display: flex; animation: fofcoFadeIn 0.2s; }
            @keyframes fofcoFadeIn { from {opacity: 0;} to {opacity: 1;} }
            .fofco-wrapper .modal-box { background: #fff; padding: 30px; border-radius: 16px; box-shadow: var(--shadow-lg); width: 420px; }
            .fofco-wrapper .modal-box h3 { margin-bottom: 20px; font-size: 18px; color: #0f172a; font-weight: 600;}
            .fofco-wrapper .modal-box input[type="text"] { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; outline: none;}
            .fofco-wrapper .modal-box input[type="text"]:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
            .fofco-wrapper .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
            .fofco-wrapper .btn-primary { background: var(--primary); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer;}
            .fofco-wrapper .btn-primary:hover { background: #1d4ed8; }
            .fofco-wrapper .btn-danger { background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer;}
            .fofco-wrapper .btn-danger:hover { background: #dc2626; }
            .fofco-wrapper .btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 500; cursor: pointer;}
            .fofco-wrapper .btn-secondary:hover { background: #e2e8f0; }
            .fofco-wrapper .modal-dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; text-align: center; margin-bottom: 20px; background: #f8fafc; cursor: pointer; transition: 0.2s; }
            .fofco-wrapper .modal-dropzone:hover, .fofco-wrapper .modal-dropzone.drag-over { border-color: var(--primary); background: #eff6ff; }
            .fofco-wrapper .modal-dropzone i { font-size: 32px; color: #94a3b8; margin-bottom: 12px; }
        `;
        document.head.appendChild(style);
    }

    injectHTML() {
        // ১০০% হুবহু আগের HTML কাঠামো
        this.container.innerHTML = `
        <div class="fofco-wrapper">
            <div class="modal-overlay" id="fof-link-modal">
                <div class="modal-box">
                    <h3>Insert/Edit Link</h3>
                    <input type="text" id="fof-link-url-input" placeholder="https://example.com">
                    <div class="modal-actions">
                        <button class="btn-danger" id="fof-remove-link">Remove</button>
                        <button class="btn-secondary" id="fof-close-link-btn">Cancel</button>
                        <button class="btn-primary" id="fof-apply-link">Apply Link</button>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="fof-media-modal">
                <div class="modal-box">
                    <h3>Insert Media</h3>
                    <input type="text" id="fof-media-url-input" placeholder="Image or Video URL...">
                    <div style="text-align: center; margin-bottom: 15px; color: var(--text-muted); font-size: 13px; font-weight: 500;">OR</div>
                    <div class="modal-dropzone" id="fof-media-dropzone">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Drag & Drop here or <b>Browse Files</b></p>
                        <input type="file" id="fof-modal-file-input" accept="image/*,video/*" style="display:none;">
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" id="fof-close-media-btn">Cancel</button>
                        <button class="btn-primary" id="fof-apply-media">Insert</button>
                    </div>
                </div>
            </div>

            <div class="editor-container">
                <div id="fof-img-toolbar" class="img-toolbar">
                    <button data-align="left" title="Wrap Left"><i class="fas fa-align-left"></i></button>
                    <button data-align="none" title="Center (No Wrap)"><i class="fas fa-align-center"></i></button>
                    <button data-align="right" title="Wrap Right"><i class="fas fa-align-right"></i></button>
                </div>
                <div id="fof-img-resizer" class="img-resizer"></div>

                <div class="toolbar">
                    <div class="dropdown-wrapper" id="fof-font-dropdown">
                        <button class="tool-btn fof-dd-btn" data-target="fof-font-dropdown" style="width: 140px; justify-content: space-between; border: 1px solid var(--border);">
                            <span id="fof-active-font">Roboto</span> <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
                        </button>
                        <div class="dropdown-menu">
                            <div class="font-search-box">
                                <input type="text" id="fof-font-input" placeholder="Search Font...">
                                <button id="fof-font-search-btn"><i class="fas fa-search"></i></button>
                            </div>
                            <div class="font-section">Recent Fonts</div>
                            <div class="font-list" id="fof-recent-fonts"></div>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="font-size-control">
                        <button id="fof-size-dec" title="Decrease font size"><i class="fas fa-minus" style="font-size: 10px;"></i></button>
                        <input type="number" id="fof-font-size-input" value="16" min="1" max="200" title="Font Size">
                        <button id="fof-size-inc" title="Increase font size"><i class="fas fa-plus" style="font-size: 10px;"></i></button>
                    </div>

                    <div class="divider"></div>

                    <div class="dropdown-wrapper" id="fof-format-dropdown">
                        <button class="tool-btn fof-dd-btn" data-target="fof-format-dropdown" style="width: 125px; justify-content: space-between;">
                            <span id="fof-active-format">Paragraph</span> <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
                        </button>
                        <div class="dropdown-menu list-menu" id="fof-format-list">
                            <button data-tag="P" data-name="Paragraph">Paragraph</button>
                            <button data-tag="H1" data-name="Heading 1" style="font-size: 22px; font-weight: 600;">Heading 1</button>
                            <button data-tag="H2" data-name="Heading 2" style="font-size: 18px; font-weight: 600;">Heading 2</button>
                            <button data-tag="H3" data-name="Heading 3" style="font-size: 16px; font-weight: 600;">Heading 3</button>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <button class="tool-btn fof-format-btn" id="fof-btn-bold" data-cmd="bold" title="Bold"><i class="fas fa-bold"></i></button>
                    <button class="tool-btn fof-format-btn" id="fof-btn-italic" data-cmd="italic" title="Italic"><i class="fas fa-italic"></i></button>
                    <button class="tool-btn fof-format-btn" id="fof-btn-underline" data-cmd="underline" title="Underline"><i class="fas fa-underline"></i></button>
                    <button class="tool-btn fof-format-btn" id="fof-btn-strikeThrough" data-cmd="strikeThrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
                    <button class="tool-btn" id="fof-btn-overline" title="Aboveline"><i class="fas fa-overline"></i>A&#773;</button>

                    <div class="divider"></div>

                    <div class="dropdown-wrapper" id="fof-color-dropdown">
                        <button class="tool-btn fof-dd-btn" data-target="fof-color-dropdown" title="Text Color">
                            <i class="fas fa-font" id="fof-color-icon"></i> <i class="fas fa-caret-down" style="font-size: 12px;"></i>
                        </button>
                        <div class="dropdown-menu color-panel">
                            <div class="color-grid" id="fof-text-colors-grid">
                                <div class="color-btn" style="background: #000000;" data-color="#000000"></div><div class="color-btn" style="background: #475569;" data-color="#475569"></div>
                                <div class="color-btn" style="background: #ef4444;" data-color="#ef4444"></div><div class="color-btn" style="background: #f97316;" data-color="#f97316"></div>
                                <div class="color-btn" style="background: #eab308;" data-color="#eab308"></div><div class="color-btn" style="background: #22c55e;" data-color="#22c55e"></div>
                                <div class="color-btn" style="background: #06b6d4;" data-color="#06b6d4"></div><div class="color-btn" style="background: #3b82f6;" data-color="#3b82f6"></div>
                                <div class="color-btn" style="background: #8b5cf6;" data-color="#8b5cf6"></div><div class="color-btn" style="background: #ec4899;" data-color="#ec4899"></div>
                            </div>
                            <button class="color-action-btn" id="fof-custom-color-btn"><i class="fas fa-palette"></i> Custom Color</button>
                            <input type="color" id="fof-native-color-input" class="native-color-picker">
                        </div>
                    </div>

                    <div class="dropdown-wrapper" id="fof-hl-dropdown">
                        <button class="tool-btn fof-dd-btn" data-target="fof-hl-dropdown" title="Highlighter">
                            <i class="fas fa-highlighter" id="fof-hl-icon"></i> <i class="fas fa-caret-down" style="font-size: 12px;"></i>
                        </button>
                        <div class="dropdown-menu color-panel">
                            <div class="color-grid" id="fof-hl-colors-grid">
                                <div class="color-btn" style="background: #ff9fae;" data-color="#ff9fae"></div><div class="color-btn" style="background: #fde995;" data-color="#fde995"></div>
                                <div class="color-btn" style="background: #a6e1c5;" data-color="#a6e1c5"></div><div class="color-btn" style="background: #a7e0f6;" data-color="#a7e0f6"></div>
                                <div class="color-btn" style="background: #e1a7fb;" data-color="#e1a7fb"></div>
                            </div>
                            <button class="color-action-btn" id="fof-clear-hl-btn"><i class="fas fa-eraser"></i> Clear Highlight</button>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <button class="tool-btn fof-format-btn" id="fof-btn-justifyLeft" data-cmd="justifyLeft"><i class="fas fa-align-left"></i></button>
                    <button class="tool-btn fof-format-btn" id="fof-btn-justifyCenter" data-cmd="justifyCenter"><i class="fas fa-align-center"></i></button>
                    <button class="tool-btn fof-format-btn" id="fof-btn-justifyRight" data-cmd="justifyRight"><i class="fas fa-align-right"></i></button>

                    <div class="divider"></div>

                    <button class="tool-btn fof-format-btn" id="fof-btn-insertOrderedList" data-cmd="insertOrderedList"><i class="fas fa-list-ol"></i></button>
                    <div class="dropdown-wrapper" id="fof-list-dropdown">
                        <button class="tool-btn fof-dd-btn" data-target="fof-list-dropdown"><i class="fas fa-list-ul"></i> <i class="fas fa-caret-down" style="font-size: 12px;"></i></button>
                        <div class="dropdown-menu list-menu" id="fof-list-types">
                            <button data-type="disc">&bull; Disc</button>
                            <button data-type="circle">&#9675; Circle</button>
                            <button data-type="square">&#9632; Square</button>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <button class="tool-btn" id="fof-open-link-modal"><i class="fas fa-link"></i></button>
                    <button class="tool-btn" id="fof-open-media-modal"><i class="fas fa-image"></i></button>
                    
                    <div class="divider"></div>

                    <button class="tool-btn fof-format-btn" data-cmd="formatBlock" data-val="BLOCKQUOTE"><i class="fas fa-quote-right"></i></button>
                    <button class="tool-btn" id="fof-btn-code"><i class="fas fa-code"></i></button>
                    <button class="tool-btn fof-format-btn" data-cmd="removeFormat"><i class="fas fa-eraser"></i></button>
                </div>

                <div id="fof-editor" class="editor-area" contenteditable="true" spellcheck="false">
                    <p>Start typing in your FOFcoEditor here...</p>
                </div>
            </div>
        </div>
        `;
    }

    initLogic() {
        const editor = this.container.querySelector('#fof-editor');
        let savedSelection = null;

        // Core Functions
        const saveSelection = () => { const sel = window.getSelection(); if (sel.rangeCount > 0) savedSelection = sel.getRangeAt(0); };
        const restoreSelection = () => { if (savedSelection) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedSelection); } };
        const formatDoc = (cmd, val = null) => { document.execCommand(cmd, false, val); editor.focus(); updateActiveStates(); };
        const closeAllDropdowns = () => { this.container.querySelectorAll('.dropdown-wrapper').forEach(el => el.classList.remove('active')); };

        // Prevent Focus Loss on buttons
        this.container.querySelectorAll('.tool-btn, .dropdown-menu button, .color-btn, .color-action-btn').forEach(btn => {
            btn.addEventListener('mousedown', e => e.preventDefault());
        });

        // Basic formatting triggers
        this.container.querySelectorAll('.fof-format-btn').forEach(btn => {
            btn.onclick = () => formatDoc(btn.dataset.cmd, btn.dataset.val);
        });

        // Dropdowns Toggles
        this.container.querySelectorAll('.fof-dd-btn').forEach(btn => {
            btn.onclick = () => {
                const target = this.container.querySelector('#' + btn.dataset.target);
                const isActive = target.classList.contains('active');
                closeAllDropdowns();
                if(!isActive) target.classList.add('active');
            };
        });

        document.addEventListener('mousedown', (e) => {
            if(!e.target.closest('.dropdown-wrapper') && !e.target.closest('.font-size-control')) closeAllDropdowns();
        });

        // Font Family Logic
        const loadedFonts = new Set(['Roboto', 'Inter']);
        let recentFonts = JSON.parse(localStorage.getItem('fof_fonts')) || ['Roboto', 'Open Sans'];
        
        const loadCSS = (name) => {
            if(loadedFonts.has(name)) return;
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;600&display=swap`;
            link.rel = "stylesheet"; document.head.appendChild(link); loadedFonts.add(name);
        };
        
        const applyFont = (name) => {
            saveSelection(); restoreSelection(); loadCSS(name);
            this.container.querySelector('#fof-active-font').innerText = name;
            formatDoc('fontName', name); closeAllDropdowns();
            if (!recentFonts.includes(name)) {
                recentFonts.unshift(name);
                if(recentFonts.length > 8) recentFonts.pop();
                localStorage.setItem('fof_fonts', JSON.stringify(recentFonts));
                renderRecentFonts();
            }
        };

        const renderRecentFonts = () => {
            const box = this.container.querySelector('#fof-recent-fonts'); box.innerHTML = '';
            recentFonts.forEach(font => {
                const div = document.createElement('div'); div.className = 'font-item'; div.innerText = font; div.style.fontFamily = font;
                div.onmouseenter = () => loadCSS(font);
                div.onmousedown = (e) => { e.preventDefault(); applyFont(font); };
                box.appendChild(div);
            });
        };
        recentFonts.forEach(f => loadCSS(f)); renderRecentFonts();

        const fontInput = this.container.querySelector('#fof-font-input');
        const fetchFont = async () => {
            let name = fontInput.value.trim(); if (!name) return;
            name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            if (loadedFonts.has(name) || recentFonts.includes(name)) { applyFont(name); return; }
            try {
                const url = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;600&display=swap`;
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) { loadCSS(name, url); applyFont(name); fontInput.value = ''; } 
                else alert(`Font "${name}" not found.`);
            } catch (e) { console.error(e); }
        };
        this.container.querySelector('#fof-font-search-btn').onclick = fetchFont;
        fontInput.onkeypress = (e) => { if(e.key === 'Enter') fetchFont(); };

        // Font Size Logic (Docs Style)
        const sizeInput = this.container.querySelector('#fof-font-size-input');
        const applyDirectFontSize = (px) => {
            if(!px) return; saveSelection(); restoreSelection();
            document.execCommand('fontSize', false, '7');
            editor.querySelectorAll('font[size="7"]').forEach(f => { f.removeAttribute('size'); f.style.fontSize = px + 'px'; });
        };
        const changeFontSize = (delta) => {
            let cur = parseInt(sizeInput.value) || 16; let n = cur + delta; if(n<1) n=1;
            sizeInput.value = n; applyDirectFontSize(n);
        };
        this.container.querySelector('#fof-size-inc').onclick = () => changeFontSize(1);
        this.container.querySelector('#fof-size-dec').onclick = () => changeFontSize(-1);
        sizeInput.onchange = () => applyDirectFontSize(sizeInput.value);
        sizeInput.onkeydown = (e) => { if(e.key==='Enter'){ e.preventDefault(); applyDirectFontSize(sizeInput.value); editor.focus(); }};

        // Formats (Headings)
        this.container.querySelectorAll('#fof-format-list button').forEach(b => {
            b.onclick = () => { formatDoc('formatBlock', b.dataset.tag); this.container.querySelector('#fof-active-format').innerText = b.dataset.name; closeAllDropdowns(); };
        });

        // Colors
        this.container.querySelectorAll('#fof-text-colors-grid .color-btn').forEach(b => {
            b.onclick = () => { formatDoc('foreColor', b.dataset.color); this.container.querySelector('#fof-color-icon').style.color = b.dataset.color; closeAllDropdowns(); };
        });
        const nativeColor = this.container.querySelector('#fof-native-color-input');
        this.container.querySelector('#fof-custom-color-btn').onclick = () => nativeColor.click();
        nativeColor.onchange = (e) => { formatDoc('foreColor', e.target.value); this.container.querySelector('#fof-color-icon').style.color = e.target.value; closeAllDropdowns(); };

        this.container.querySelectorAll('#fof-hl-colors-grid .color-btn').forEach(b => {
            b.onclick = () => { document.execCommand('backColor', false, b.dataset.color); this.container.querySelector('#fof-hl-icon').style.color = b.dataset.color; closeAllDropdowns(); };
        });
        this.container.querySelector('#fof-clear-hl-btn').onclick = () => { document.execCommand('backColor', false, 'rgba(0,0,0,0)'); this.container.querySelector('#fof-hl-icon').style.color = 'var(--text-muted)'; closeAllDropdowns(); };

        // Aboveline & Lists
        this.container.querySelector('#fof-btn-overline').onclick = () => {
            const sel = window.getSelection(); if (!sel.rangeCount) return;
            const span = document.createElement('span'); span.style.textDecoration = 'overline';
            sel.getRangeAt(0).surroundContents(span);
        };
        this.container.querySelectorAll('#fof-list-types button').forEach(b => {
            b.onclick = () => {
                formatDoc('insertUnorderedList'); const sel = window.getSelection(); let node = sel.anchorNode;
                while (node && node.nodeName !== 'UL' && node.nodeName !== 'DIV') { node = node.parentNode; }
                if (node && node.nodeName === 'UL') node.style.listStyleType = b.dataset.type;
                closeAllDropdowns();
            };
        });

        // Code
        this.container.querySelector('#fof-btn-code').onclick = () => formatDoc('insertHTML', `<pre><code>// code...</code></pre><p><br></p>`);

        // Update Active States & Smart Font Size Detector
        const toggleCmds = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertOrderedList'];
        const updateActiveStates = () => {
            toggleCmds.forEach(cmd => {
                const btn = this.container.querySelector(`#fof-btn-${cmd}`);
                if (btn) { if(document.queryCommandState(cmd)) btn.classList.add('active'); else btn.classList.remove('active'); }
            });
            try {
                const sel = window.getSelection();
                if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
                    let p = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
                    let size = window.getComputedStyle(p).fontSize;
                    if(size) sizeInput.value = parseInt(size);
                }
            } catch(e){}
        };
        editor.addEventListener('keyup', updateActiveStates); editor.addEventListener('mouseup', updateActiveStates);

        // MODALS
        const linkModal = this.container.querySelector('#fof-link-modal');
        const mediaModal = this.container.querySelector('#fof-media-modal');
        
        this.container.querySelector('#fof-open-link-modal').onclick = () => { saveSelection(); this.container.querySelector('#fof-link-url-input').value = ''; linkModal.classList.add('active'); };
        this.container.querySelector('#fof-close-link-btn').onclick = () => { linkModal.classList.remove('active'); editor.focus(); };
        this.container.querySelector('#fof-remove-link').onclick = () => { restoreSelection(); formatDoc('unlink'); linkModal.classList.remove('active'); };
        this.container.querySelector('#fof-apply-link').onclick = () => { restoreSelection(); formatDoc('createLink', this.container.querySelector('#fof-link-url-input').value); linkModal.classList.remove('active'); };

        this.container.querySelector('#fof-open-media-modal').onclick = () => { saveSelection(); this.container.querySelector('#fof-media-url-input').value = ''; mediaModal.classList.add('active'); };
        this.container.querySelector('#fof-close-media-btn').onclick = () => { mediaModal.classList.remove('active'); editor.focus(); };
        this.container.querySelector('#fof-apply-media').onclick = () => { restoreSelection(); formatDoc('insertHTML', `<img src="${this.container.querySelector('#fof-media-url-input').value}">`); mediaModal.classList.remove('active'); };

        const processFile = (file) => {
            restoreSelection(); const reader = new FileReader();
            reader.onload = (ev) => {
                const html = file.type.startsWith('image/') ? `<img src="${ev.target.result}">` : `<video controls style="max-width:100%; border-radius:8px;"><source src="${ev.target.result}"></video>`;
                formatDoc('insertHTML', html); mediaModal.classList.remove('active');
            };
            reader.readAsDataURL(file);
        };
        this.container.querySelector('#fof-modal-file-input').onchange = (e) => { if(e.target.files[0]) processFile(e.target.files[0]); };
        
        const dropzone = this.container.querySelector('#fof-media-dropzone');
        dropzone.onclick = () => this.container.querySelector('#fof-modal-file-input').click();
        dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); };
        dropzone.ondragleave = () => dropzone.classList.remove('drag-over');
        dropzone.ondrop = (e) => { e.preventDefault(); dropzone.classList.remove('drag-over'); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };

        editor.ondragover = (e) => { e.preventDefault(); editor.classList.add('drag-over'); };
        editor.ondragleave = () => editor.classList.remove('drag-over');
        editor.ondrop = (e) => {
            e.preventDefault(); editor.classList.remove('drag-over');
            if(e.dataTransfer.files[0] && (e.dataTransfer.files[0].type.startsWith('image/') || e.dataTransfer.files[0].type.startsWith('video/'))) {
                let range; if(document.caretRangeFromPoint) range = document.caretRangeFromPoint(e.clientX, e.clientY);
                else if(e.rangeParent) { range = document.createRange(); range.setStart(e.rangeParent, e.rangeOffset); }
                const sel = window.getSelection(); sel.removeAllRanges(); if(range) sel.addRange(range);
                saveSelection(); processFile(e.dataTransfer.files[0]); 
            }
        };

        // Image Resize & Toolbar
        let selectedImg = null, isDragging = false, startX = 0, startW = 0;
        const imgToolbar = this.container.querySelector('#fof-img-toolbar');
        const resizer = this.container.querySelector('#fof-img-resizer');
        
        const updateImgOverlays = () => {
            if(!selectedImg) return;
            const cRect = this.container.querySelector('.editor-container').getBoundingClientRect();
            const rect = selectedImg.getBoundingClientRect();
            imgToolbar.style.display = 'flex'; imgToolbar.style.top = (rect.top - cRect.top - 40) + 'px'; imgToolbar.style.left = (rect.left - cRect.left + 10) + 'px';
            resizer.style.display = 'block'; resizer.style.top = (rect.bottom - cRect.top - 7) + 'px'; resizer.style.left = (rect.right - cRect.left - 7) + 'px';
        };

        editor.onclick = (e) => {
            if(e.target.tagName === 'IMG') { if(selectedImg) selectedImg.classList.remove('selected'); selectedImg = e.target; selectedImg.classList.add('selected'); updateImgOverlays(); } 
            else { if(selectedImg) selectedImg.classList.remove('selected'); selectedImg = null; imgToolbar.style.display = 'none'; resizer.style.display = 'none'; }
        };

        resizer.onmousedown = (e) => { isDragging = true; startX = e.clientX; startW = selectedImg.clientWidth; e.preventDefault(); };
        document.addEventListener('mousemove', (e) => { if(isDragging && selectedImg) { selectedImg.style.width = (startW + (e.clientX - startX)) + 'px'; updateImgOverlays(); } });
        document.addEventListener('mouseup', () => isDragging = false);
        editor.onscroll = () => updateImgOverlays();

        this.container.querySelectorAll('#fof-img-toolbar button').forEach(b => {
            b.onclick = () => {
                if(!selectedImg) return; const type = b.dataset.align;
                selectedImg.style.display = type === 'none' ? 'block' : 'inline-block'; selectedImg.style.float = type;
                selectedImg.style.margin = type === 'none' ? '15px auto' : (type === 'left' ? '0 15px 15px 0' : '0 0 15px 15px');
                setTimeout(updateImgOverlays, 10);
            };
        });

        // Auto LaTeX
        const renderLatex = () => {
            if(typeof katex === 'undefined') return;
            const sel = window.getSelection(); if(!sel.rangeCount) return;
            const marker = document.createElement('span'); const mId = 'caret-'+Math.random().toString(36).substr(2,9); marker.id = mId;
            sel.getRangeAt(0).insertNode(marker);
            let content = editor.innerHTML;
            
            const compile = (tex, display) => {
                try {
                    let clean = tex.replace(/<span id="caret-.*?"><\/span>/g, '').trim();
                    const html = katex.renderToString(clean, {displayMode: display, throwOnError: false});
                    return `<span class="latex-node ${display?'block-math':'inline-math'}" contenteditable="false" data-tex="${clean}">${html}</span>`;
                } catch(e) { return null; }
            };

            content = content.replace(/(?<!\$)\$\$([^\$]+?)\$\$(?!\$)/g, (m, tex) => tex.includes(mId) ? m : (compile(tex, true) || m));
            content = content.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (m, tex) => tex.includes(mId) ? m : (compile(tex, false) || m));
            
            editor.innerHTML = content;
            const rm = document.getElementById(mId);
            if(rm) { const nr = document.createRange(); nr.setStartAfter(rm); nr.collapse(true); sel.removeAllRanges(); sel.addRange(nr); rm.remove(); }
        };

        editor.addEventListener('keyup', (e) => { if(e.key === ' ' || e.key === 'Enter') renderLatex(); });
        editor.addEventListener('dblclick', (e) => {
            const node = e.target.closest('.latex-node');
            if(node) {
                const tex = node.getAttribute('data-tex'); const block = node.classList.contains('block-math');
                node.parentNode.replaceChild(document.createTextNode(block ? `$$ ${tex} $$` : `$ ${tex} $`), node);
            }
        });

        // Paste Sanitize
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            document.execCommand('insertHTML', false, (e.originalEvent || e).clipboardData.getData('text/plain').replace(/\n/g, '<br>'));
        });
    }
}

// Global Export
window.FOFcoEditor = FOFcoEditor;
