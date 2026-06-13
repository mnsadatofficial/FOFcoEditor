class FOFcoEditor {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error("FOFcoEditor: Container element not found!");
      return;
    }
    this.init();
  }

  init() {
    this.injectDependencies();
    this.injectCSS();
    this.injectHTML();

    // ডম (DOM) লোড হওয়ার জন্য সামান্য সময় দেওয়া হচ্ছে
    setTimeout(() => {
      this.initLogic();
    }, 100);
  }

  injectDependencies() {
    const head = document.head;
    const links = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
    ];
    links.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        head.appendChild(link);
      }
    });

    if (!document.querySelector('script[src*="katex.min.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js";
      script.defer = true;
      head.appendChild(script);
    }
  }

  injectCSS() {
    if (document.getElementById("fofco-editor-styles")) return;
    const style = document.createElement("style");
    style.id = "fofco-editor-styles";
    style.innerHTML = `
            :root {
                --fof-primary: #2563eb; --fof-bg: #ffffff; --fof-border: #e2e8f0;
                --fof-text: #1e293b; --fof-muted: #64748b; --fof-hover: #f1f5f9;
                --fof-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                --fof-shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .fof-container * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
            .fof-container {
                width: 100%; background: var(--fof-bg); border: 1px solid var(--fof-border);
                border-radius: 12px; box-shadow: var(--fof-shadow); display: flex;
                flex-direction: column; position: relative; color: var(--fof-text);
            }
            .fof-toolbar {
                padding: 12px 16px; background: #ffffff; border-bottom: 1px solid var(--fof-border);
                border-radius: 12px 12px 0 0; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
            }
            .fof-divider { width: 1px; height: 20px; background: var(--fof-border); margin: 0 8px; }
            .fof-btn {
                padding: 8px 10px; border: 1px solid transparent; background: transparent;
                border-radius: 6px; cursor: pointer; color: var(--fof-muted); font-size: 14px;
                display: inline-flex; align-items: center; gap: 6px; transition: 0.2s;
            }
            .fof-btn:hover { background: var(--fof-hover); color: var(--fof-text); }
            .fof-btn.active { background: #eff6ff; color: var(--fof-primary); }
            
            /* Dropdowns & Modals CSS */
            .fof-dropdown-wrapper { position: relative; }
            .fof-dropdown-menu {
                position: absolute; top: calc(100% + 6px); left: 0; background: #fff;
                border: 1px solid var(--fof-border); border-radius: 10px; box-shadow: var(--fof-shadow-lg);
                display: none; z-index: 100; min-width: 100%; overflow: hidden;
            }
            .fof-dropdown-wrapper.active .fof-dropdown-menu { display: block; }
            .fof-font-search { display: flex; padding: 10px; background: #f8fafc; border-bottom: 1px solid var(--fof-border); }
            .fof-font-search input { flex: 1; padding: 8px; border: 1px solid var(--fof-border); border-radius: 6px; outline: none;}
            .fof-font-search button { background: var(--fof-primary); color: #fff; padding: 8px 12px; margin-left: 6px; border-radius: 6px; border:none; cursor:pointer;}
            .fof-list-menu { min-width: 160px; padding: 6px; }
            .fof-list-menu button { width: 100%; justify-content: flex-start; padding: 8px 12px; border:none; background:transparent; cursor:pointer; border-radius:6px;}
            .fof-list-menu button:hover { background: var(--fof-hover); }
            
            /* Font Size Control */
            .fof-size-control { display: flex; align-items: center; border: 1px solid var(--fof-border); border-radius: 6px; height: 32px; overflow: hidden; }
            .fof-size-control button { border: none; background: #fff; padding: 0 10px; cursor: pointer; color: var(--fof-muted); }
            .fof-size-control button:hover { background: var(--fof-hover); }
            .fof-size-control input { width: 40px; text-align: center; border: none; border-left: 1px solid var(--fof-border); border-right: 1px solid var(--fof-border); outline: none; -moz-appearance: textfield;}
            .fof-size-control input::-webkit-outer-spin-button, .fof-size-control input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            
            /* Color Grid */
            .fof-color-panel { padding: 12px; min-width: 190px; }
            .fof-color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 10px;}
            .fof-color-btn { width: 26px; height: 26px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; }
            .fof-color-action { width: 100%; padding: 8px; background: #f8fafc; border: 1px solid var(--fof-border); border-radius: 6px; cursor: pointer; display:flex; justify-content:center; gap:6px;}
            
            /* Editor Area */
            .fof-editor-area { min-height: 400px; padding: 30px 40px; outline: none; line-height: 1.7; font-size: 16px; overflow-y: auto; }
            .fof-editor-area ul, .fof-editor-area ol { margin-left: 35px; padding-left: 5px; margin-bottom: 1em;}
            .fof-editor-area li { margin-bottom: 8px; }
            .fof-editor-area h1, .fof-editor-area h2, .fof-editor-area h3, .fof-editor-area h4 { font-weight: 600; margin: 1.2em 0 0.5em 0; }
            .fof-editor-area blockquote { border-left: 4px solid var(--fof-primary); padding-left: 16px; margin: 16px 0; font-style: italic; background: #f8fafc; padding: 12px; border-radius: 0 8px 8px 0;}
            .fof-editor-area pre { background: #1e293b; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; }
            .fof-editor-area img { max-width: 100%; cursor: pointer; border-radius: 6px; }
            .fof-editor-area img.selected { outline: 3px solid var(--fof-primary); }
            
            /* Overlays */
            .fof-img-toolbar { position: absolute; display: none; background: #1e293b; padding: 6px; border-radius: 8px; z-index: 50; gap: 4px; }
            .fof-img-toolbar button { border: none; background: transparent; cursor: pointer; color: #fff; padding: 6px 8px;}
            .fof-resizer { position: absolute; width: 14px; height: 14px; background: var(--fof-primary); border: 2px solid #fff; border-radius: 50%; cursor: nwse-resize; z-index: 60; display: none; }
            .fof-latex { cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: 0.2s;}
            .fof-latex.inline-math { display: inline-block; vertical-align: middle; }
            .fof-latex.block-math { display: block; text-align: center; margin: 20px 0; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--fof-border);}
            
            /* Modals */
            .fof-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.5); display: none; justify-content: center; align-items: center; z-index: 999; backdrop-filter: blur(4px); }
            .fof-modal-overlay.active { display: flex; }
            .fof-modal-box { background: #fff; padding: 30px; border-radius: 16px; width: 420px; }
            .fof-modal-box input[type="text"] { width: 100%; padding: 12px; border: 1px solid var(--fof-border); border-radius: 8px; margin-bottom: 20px; outline: none; }
            .fof-dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; text-align: center; margin-bottom: 20px; background: #f8fafc; cursor: pointer; }
            .fof-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
            .fof-btn-primary { background: var(--fof-primary); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer;}
            .fof-btn-danger { background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer;}
            .fof-btn-secondary { background: #f1f5f9; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer;}
        `;
    document.head.appendChild(style);
  }

  injectHTML() {
    this.container.innerHTML = `
        <div class="fof-modal-overlay" id="fof-link-modal">
            <div class="fof-modal-box">
                <h3 style="margin-bottom:15px;">Insert/Edit Link</h3>
                <input type="text" id="fof-link-input" placeholder="https://example.com">
                <div class="fof-modal-actions">
                    <button class="fof-btn-danger" id="fof-remove-link">Remove</button>
                    <button class="fof-btn-secondary" id="fof-close-link">Cancel</button>
                    <button class="fof-btn-primary" id="fof-apply-link">Apply</button>
                </div>
            </div>
        </div>

        <div class="fof-modal-overlay" id="fof-media-modal">
            <div class="fof-modal-box">
                <h3 style="margin-bottom:15px;">Insert Media</h3>
                <input type="text" id="fof-media-input" placeholder="Image or Video URL...">
                <div style="text-align: center; margin-bottom: 10px;">OR</div>
                <div class="fof-dropzone" id="fof-media-dropzone">
                    <i class="fas fa-cloud-upload-alt" style="font-size:30px; color:#94a3b8; margin-bottom:10px;"></i>
                    <p>Drag & Drop here or <b>Browse</b></p>
                    <input type="file" id="fof-file-input" accept="image/*,video/*" style="display:none;">
                </div>
                <div class="fof-modal-actions">
                    <button class="fof-btn-secondary" id="fof-close-media">Cancel</button>
                    <button class="fof-btn-primary" id="fof-apply-media">Insert</button>
                </div>
            </div>
        </div>

        <div class="fof-container">
            <div id="fof-img-toolbar" class="fof-img-toolbar">
                <button data-align="left" title="Wrap Left"><i class="fas fa-align-left"></i></button>
                <button data-align="none" title="Center"><i class="fas fa-align-center"></i></button>
                <button data-align="right" title="Wrap Right"><i class="fas fa-align-right"></i></button>
            </div>
            <div id="fof-img-resizer" class="fof-resizer"></div>

            <div class="fof-toolbar">
                <div class="fof-size-control">
                    <button id="fof-size-dec"><i class="fas fa-minus" style="font-size:10px;"></i></button>
                    <input type="number" id="fof-size-input" value="16">
                    <button id="fof-size-inc"><i class="fas fa-plus" style="font-size:10px;"></i></button>
                </div>
                
                <div class="fof-divider"></div>

                <div class="fof-dropdown-wrapper" id="fof-format-dd">
                    <button class="fof-btn" style="width: 120px; justify-content: space-between;">
                        <span id="fof-active-format">Paragraph</span> <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
                    </button>
                    <div class="fof-dropdown-menu fof-list-menu">
                        <button data-format="P">Paragraph</button>
                        <button data-format="H1" style="font-size: 22px; font-weight: bold;">Heading 1</button>
                        <button data-format="H2" style="font-size: 18px; font-weight: bold;">Heading 2</button>
                        <button data-format="H3" style="font-size: 16px; font-weight: bold;">Heading 3</button>
                    </div>
                </div>

                <div class="fof-divider"></div>

                <button class="fof-btn fof-cmd" data-cmd="bold"><i class="fas fa-bold"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="italic"><i class="fas fa-italic"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="underline"><i class="fas fa-underline"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="strikeThrough"><i class="fas fa-strikethrough"></i></button>

                <div class="fof-divider"></div>

                <div class="fof-dropdown-wrapper" id="fof-color-dd">
                    <button class="fof-btn"><i class="fas fa-font" id="fof-color-icon"></i> <i class="fas fa-caret-down" style="font-size: 12px;"></i></button>
                    <div class="fof-dropdown-menu fof-color-panel">
                        <div class="fof-color-grid" id="fof-text-colors">
                            <div class="fof-color-btn" style="background:#000;"></div><div class="fof-color-btn" style="background:#ef4444;"></div>
                            <div class="fof-color-btn" style="background:#3b82f6;"></div><div class="fof-color-btn" style="background:#22c55e;"></div>
                            <div class="fof-color-btn" style="background:#eab308;"></div>
                        </div>
                        <input type="color" id="fof-native-color" style="opacity:0; position:absolute; width:0; height:0;">
                        <button class="fof-color-action" onclick="document.getElementById('fof-native-color').click()"><i class="fas fa-palette"></i> Custom</button>
                    </div>
                </div>

                <div class="fof-dropdown-wrapper" id="fof-hl-dd">
                    <button class="fof-btn"><i class="fas fa-highlighter" id="fof-hl-icon"></i> <i class="fas fa-caret-down" style="font-size: 12px;"></i></button>
                    <div class="fof-dropdown-menu fof-color-panel">
                        <div class="fof-color-grid" id="fof-hl-colors">
                            <div class="fof-color-btn" style="background:#ff9fae;"></div><div class="fof-color-btn" style="background:#fde995;"></div>
                            <div class="fof-color-btn" style="background:#a6e1c5;"></div><div class="fof-color-btn" style="background:#a7e0f6;"></div>
                            <div class="fof-color-btn" style="background:#e1a7fb;"></div>
                        </div>
                        <button class="fof-color-action" id="fof-clear-hl"><i class="fas fa-eraser"></i> Clear</button>
                    </div>
                </div>

                <div class="fof-divider"></div>

                <button class="fof-btn fof-cmd" data-cmd="justifyLeft"><i class="fas fa-align-left"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="justifyCenter"><i class="fas fa-align-center"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="justifyRight"><i class="fas fa-align-right"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="insertOrderedList"><i class="fas fa-list-ol"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="insertUnorderedList"><i class="fas fa-list-ul"></i></button>

                <div class="fof-divider"></div>

                <button class="fof-btn" id="fof-open-link"><i class="fas fa-link"></i></button>
                <button class="fof-btn" id="fof-open-media"><i class="fas fa-image"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="formatBlock" data-val="BLOCKQUOTE"><i class="fas fa-quote-right"></i></button>
                <button class="fof-btn" id="fof-insert-code"><i class="fas fa-code"></i></button>
                <button class="fof-btn fof-cmd" data-cmd="removeFormat"><i class="fas fa-eraser"></i></button>
            </div>

            <div id="fof-editor-area" class="fof-editor-area" contenteditable="true" spellcheck="false">
                <p>Start typing in your FOFcoEditor here...</p>
            </div>
        </div>
        `;
  }

  initLogic() {
    const editor = document.getElementById("fof-editor-area");
    let savedSelection = null;

    const formatDoc = (cmd, val = null) => {
      document.execCommand(cmd, false, val);
      editor.focus();
    };
    const saveSel = () => {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) savedSelection = sel.getRangeAt(0);
    };
    const restoreSel = () => {
      if (savedSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    };

    // Prevent focus loss on buttons
    document
      .querySelectorAll(".fof-btn, .fof-dropdown-menu button")
      .forEach((b) => {
        b.addEventListener("mousedown", (e) => e.preventDefault());
      });

    // Basic Commands
    document.querySelectorAll(".fof-cmd").forEach((btn) => {
      btn.addEventListener("click", () => {
        formatDoc(btn.dataset.cmd, btn.dataset.val);
      });
    });

    // Code
    document.getElementById("fof-insert-code").onclick = () =>
      formatDoc(
        "insertHTML",
        `<pre><code>// code here...</code></pre><p><br></p>`,
      );

    // Font Size Logic
    const applyFontSize = (px) => {
      if (!px) return;
      saveSel();
      restoreSel();
      document.execCommand("fontSize", false, "7");
      editor.querySelectorAll('font[size="7"]').forEach((f) => {
        f.removeAttribute("size");
        f.style.fontSize = px + "px";
      });
    };
    const sizeInput = document.getElementById("fof-size-input");
    document.getElementById("fof-size-inc").onclick = () => {
      sizeInput.value = parseInt(sizeInput.value) + 1;
      applyFontSize(sizeInput.value);
    };
    document.getElementById("fof-size-dec").onclick = () => {
      sizeInput.value = parseInt(sizeInput.value) - 1;
      applyFontSize(sizeInput.value);
    };
    sizeInput.onchange = () => applyFontSize(sizeInput.value);
    sizeInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFontSize(sizeInput.value);
        editor.focus();
      }
    };

    // Formats Dropdown
    const formatBtn = document.querySelector("#fof-format-dd > button");
    formatBtn.onclick = () =>
      document.getElementById("fof-format-dd").classList.toggle("active");
    document
      .querySelectorAll("#fof-format-dd .fof-list-menu button")
      .forEach((b) => {
        b.onclick = () => {
          formatDoc("formatBlock", b.dataset.format);
          document.getElementById("fof-active-format").innerText = b.innerText;
          document.getElementById("fof-format-dd").classList.remove("active");
        };
      });

    // Colors
    document.querySelector("#fof-color-dd > button").onclick = () =>
      document.getElementById("fof-color-dd").classList.toggle("active");
    document
      .querySelectorAll("#fof-text-colors .fof-color-btn")
      .forEach((b) => {
        b.onclick = () => {
          formatDoc("foreColor", b.style.backgroundColor);
          document.getElementById("fof-color-icon").style.color =
            b.style.backgroundColor;
          document.getElementById("fof-color-dd").classList.remove("active");
        };
      });
    document.getElementById("fof-native-color").onchange = (e) => {
      formatDoc("foreColor", e.target.value);
      document.getElementById("fof-color-icon").style.color = e.target.value;
      document.getElementById("fof-color-dd").classList.remove("active");
    };

    // Highlighter
    document.querySelector("#fof-hl-dd > button").onclick = () =>
      document.getElementById("fof-hl-dd").classList.toggle("active");
    document.querySelectorAll("#fof-hl-colors .fof-color-btn").forEach((b) => {
      b.onclick = () => {
        document.execCommand("backColor", false, b.style.backgroundColor);
        document.getElementById("fof-hl-icon").style.color =
          b.style.backgroundColor;
        document.getElementById("fof-hl-dd").classList.remove("active");
      };
    });
    document.getElementById("fof-clear-hl").onclick = () => {
      document.execCommand("backColor", false, "rgba(0,0,0,0)");
      document.getElementById("fof-hl-icon").style.color = "var(--fof-muted)";
      document.getElementById("fof-hl-dd").classList.remove("active");
    };

    // Close dropdowns
    document.addEventListener("mousedown", (e) => {
      if (!e.target.closest(".fof-dropdown-wrapper")) {
        document
          .querySelectorAll(".fof-dropdown-wrapper")
          .forEach((el) => el.classList.remove("active"));
      }
    });

    // Modals
    const linkModal = document.getElementById("fof-link-modal");
    document.getElementById("fof-open-link").onclick = () => {
      saveSel();
      document.getElementById("fof-link-input").value = "";
      linkModal.classList.add("active");
    };
    document.getElementById("fof-close-link").onclick = () =>
      linkModal.classList.remove("active");
    document.getElementById("fof-remove-link").onclick = () => {
      restoreSel();
      formatDoc("unlink");
      linkModal.classList.remove("active");
    };
    document.getElementById("fof-apply-link").onclick = () => {
      restoreSel();
      formatDoc("createLink", document.getElementById("fof-link-input").value);
      linkModal.classList.remove("active");
    };

    const mediaModal = document.getElementById("fof-media-modal");
    document.getElementById("fof-open-media").onclick = () => {
      saveSel();
      document.getElementById("fof-media-input").value = "";
      mediaModal.classList.add("active");
    };
    document.getElementById("fof-close-media").onclick = () =>
      mediaModal.classList.remove("active");
    document.getElementById("fof-apply-media").onclick = () => {
      restoreSel();
      formatDoc(
        "insertHTML",
        `<img src="${document.getElementById("fof-media-input").value}">`,
      );
      mediaModal.classList.remove("active");
    };

    // File/Media Process
    const processFile = (file) => {
      restoreSel();
      const reader = new FileReader();
      reader.onload = (ev) => {
        const html = file.type.startsWith("image/")
          ? `<img src="${ev.target.result}">`
          : `<video controls style="max-width:100%"><source src="${ev.target.result}"></video>`;
        formatDoc("insertHTML", html);
        mediaModal.classList.remove("active");
      };
      reader.readAsDataURL(file);
    };
    document.getElementById("fof-file-input").onchange = (e) => {
      if (e.target.files[0]) processFile(e.target.files[0]);
    };

    const dropzone = document.getElementById("fof-media-dropzone");
    dropzone.onclick = () => document.getElementById("fof-file-input").click();
    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--fof-primary)";
    };
    dropzone.ondragleave = () => (dropzone.style.borderColor = "");
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "";
      if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
    };

    editor.ondragover = (e) => {
      e.preventDefault();
      editor.style.background = "#f0fdf4";
    };
    editor.ondragleave = () => (editor.style.background = "");
    editor.ondrop = (e) => {
      e.preventDefault();
      editor.style.background = "";
      if (e.dataTransfer.files[0]) {
        let range;
        if (document.caretRangeFromPoint)
          range = document.caretRangeFromPoint(e.clientX, e.clientY);
        else if (e.rangeParent) {
          range = document.createRange();
          range.setStart(e.rangeParent, e.rangeOffset);
        }
        const sel = window.getSelection();
        sel.removeAllRanges();
        if (range) sel.addRange(range);
        saveSel();
        processFile(e.dataTransfer.files[0]);
      }
    };

    // Image Resize & Toolbar
    let selectedImg = null,
      isDragging = false,
      startX = 0,
      startW = 0;
    const imgToolbar = document.getElementById("fof-img-toolbar");
    const resizer = document.getElementById("fof-img-resizer");

    const updateImgOverlays = () => {
      if (!selectedImg) return;
      const cRect = document
        .querySelector(".fof-container")
        .getBoundingClientRect();
      const rect = selectedImg.getBoundingClientRect();
      imgToolbar.style.display = "flex";
      imgToolbar.style.top = rect.top - cRect.top - 40 + "px";
      imgToolbar.style.left = rect.left - cRect.left + 10 + "px";
      resizer.style.display = "block";
      resizer.style.top = rect.bottom - cRect.top - 7 + "px";
      resizer.style.left = rect.right - cRect.left - 7 + "px";
    };

    editor.onclick = (e) => {
      if (e.target.tagName === "IMG") {
        if (selectedImg) selectedImg.classList.remove("selected");
        selectedImg = e.target;
        selectedImg.classList.add("selected");
        updateImgOverlays();
      } else {
        if (selectedImg) selectedImg.classList.remove("selected");
        selectedImg = null;
        imgToolbar.style.display = "none";
        resizer.style.display = "none";
      }
    };

    resizer.onmousedown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startW = selectedImg.clientWidth;
      e.preventDefault();
    };
    document.addEventListener("mousemove", (e) => {
      if (isDragging && selectedImg) {
        selectedImg.style.width = startW + (e.clientX - startX) + "px";
        updateImgOverlays();
      }
    });
    document.addEventListener("mouseup", () => (isDragging = false));
    editor.onscroll = () => updateImgOverlays();

    document.querySelectorAll("#fof-img-toolbar button").forEach((b) => {
      b.onclick = () => {
        if (!selectedImg) return;
        const type = b.dataset.align;
        selectedImg.style.display = type === "none" ? "block" : "inline-block";
        selectedImg.style.float = type;
        selectedImg.style.margin =
          type === "none"
            ? "15px auto"
            : type === "left"
              ? "0 15px 15px 0"
              : "0 0 15px 15px";
        setTimeout(updateImgOverlays, 10);
      };
    });

    // Auto LaTeX
    const renderLatex = () => {
      if (typeof katex === "undefined") return;
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const marker = document.createElement("span");
      const mId = "caret-" + Date.now();
      marker.id = mId;
      sel.getRangeAt(0).insertNode(marker);
      let content = editor.innerHTML;

      const compile = (tex, block) => {
        try {
          let clean = tex.replace(/<span id="caret-.*?"><\/span>/g, "").trim();
          const html = katex.renderToString(clean, {
            displayMode: block,
            throwOnError: false,
          });
          return `<span class="fof-latex ${block ? "block-math" : "inline-math"}" contenteditable="false" data-tex="${clean}">${html}</span>`;
        } catch (e) {
          return null;
        }
      };

      content = content.replace(/(?<!\$)\$\$([^\$]+?)\$\$(?!\$)/g, (m, tex) =>
        tex.includes(mId) ? m : compile(tex, true) || m,
      );
      content = content.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (m, tex) =>
        tex.includes(mId) ? m : compile(tex, false) || m,
      );

      editor.innerHTML = content;
      const rm = document.getElementById(mId);
      if (rm) {
        const nr = document.createRange();
        nr.setStartAfter(rm);
        nr.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nr);
        rm.remove();
      }
    };

    editor.addEventListener("keyup", (e) => {
      if (e.key === " " || e.key === "Enter") renderLatex();
    });
    editor.addEventListener("dblclick", (e) => {
      const node = e.target.closest(".fof-latex");
      if (node) {
        const tex = node.getAttribute("data-tex");
        const block = node.classList.contains("block-math");
        node.parentNode.replaceChild(
          document.createTextNode(block ? `$$ ${tex} $$` : `$ ${tex} $`),
          node,
        );
      }
    });

    // Paste Sanitize
    editor.addEventListener("paste", (e) => {
      e.preventDefault();
      document.execCommand(
        "insertHTML",
        false,
        (e.originalEvent || e).clipboardData
          .getData("text/plain")
          .replace(/\n/g, "<br>"),
      );
    });

    // Smart Font Size Detector
    const updateActive = () => {
      try {
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
          let p =
            sel.anchorNode.nodeType === 3
              ? sel.anchorNode.parentNode
              : sel.anchorNode;
          let size = window.getComputedStyle(p).fontSize;
          if (size)
            document.getElementById("fof-size-input").value = parseInt(size);
        }
      } catch (e) {}
    };
    editor.addEventListener("keyup", updateActive);
    editor.addEventListener("mouseup", updateActive);
  }
}

// Global initialization for FOFcoEditor
window.FOFcoEditor = FOFcoEditor;
