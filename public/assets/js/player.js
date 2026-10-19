const root = document.documentElement;

class DemonstrationPlayer {
  constructor() {
    this.frames = [];
    this.frameIndex = 0;
    this.speed = 50;
    this.playing = false;
    this.timer = null;
    this.marker = null;
    this.editor = null;
    this.generatedFrameCount = 0;
    this.sourceFontSize = 18;
    this.copyFeedbackTimer = null;

    this.elements = {
      sceneStatus: document.querySelector("#scene-status"),
      runtimeStatus: document.querySelector("#runtime-status"),
      speedRange: document.querySelector("#speed-range"),
      speedOutput: document.querySelector("#speed-output"),
      speedUp: document.querySelector("#speed-up"),
      speedDown: document.querySelector("#speed-down"),
      play: document.querySelector("#play-toggle"),
      playIcon: document.querySelector("#play-toggle .player-icon"),
      reset: document.querySelector("#reset"),
      previous: document.querySelector("#previous-frame"),
      next: document.querySelector("#next-frame"),
      frameRange: document.querySelector("#frame-range"),
      frameOutput: document.querySelector("#frame-output"),
      logger: document.querySelector("#logger"),
      logList: document.querySelector("#narration-list"),
      editor: document.querySelector("#source-editor")
    };
  }

  async initialize() {
    this.setState("loading", "正在加载");
    this.bindControls();
    this.bindDialogs();

    try {
      this.assertRuntimeContract();
      this.createSourceToolbar();
      const sourcePromise = this.loadSource();

      window.render_init.call(window);
      const generatedFrames = window.lineExports.init();
      this.setFrames(generatedFrames);
      this.generatedFrameCount = generatedFrames.length;
      this.setSpeed(this.speed);

      await sourcePromise;
      await this.waitForLayout();
      this.editor.resize(true);
      this.renderFrame(0, 0);
      this.setState("ready", "就绪");
    } catch (error) {
      this.fail(error);
    }
  }

  assertRuntimeContract() {
    if (!window.lineExports || typeof window.lineExports.init !== "function") {
      throw new Error("演示未提供 lineExports.init()。\n");
    }
    if (typeof window.render_init !== "function" || typeof window.render !== "function") {
      throw new Error("演示未提供 render_init() 与 render()。\n");
    }
    if (!window.ace) {
      throw new Error("Ace 源码查看器加载失败。\n");
    }
  }

  async loadSource() {
    const response = await fetch("./algorithm.c", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`algorithm.c 加载失败（HTTP ${response.status}）。`);
    }

    const source = await response.text();
    window.ace.config.set("basePath", "/assets/vendor/ace");
    this.editor = window.ace.edit(this.elements.editor);
    this.editor.setTheme("ace/theme/solarized_dark");
    this.editor.session.setMode("ace/mode/c_cpp");
    this.editor.session.setUseWorker(false);
    this.editor.setValue(source, -1);
    this.editor.setOptions({
      fontSize: "18px",
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false,
      showPrintMargin: false,
      behavioursEnabled: false,
      wrap: false
    });
    this.editor.renderer.$cursorLayer.element.style.display = "none";
    this.editor.clearSelection();
    let savedSize = 18;
    try {
      const value = Number(localStorage.getItem("dsa-source-font-size"));
      if (Number.isInteger(value) && value >= 12 && value <= 32) savedSize = value;
    } catch { /* Storage can be disabled; font controls still work for this page. */ }
    this.setSourceFontSize(savedSize);
    this.elements.copySource.disabled = false;
  }

  createSourceToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "source-toolbar";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "源码工具");
    toolbar.innerHTML = `
      <span class="source-toolbar__title">源码 <span>C / C++</span></span>
      <span id="source-copy-status" class="source-copy-status" role="status" aria-live="polite"></span>
      <button id="source-font-decrease" type="button" title="缩小代码字号" aria-label="缩小代码字号" disabled>A−</button>
      <button id="source-font-reset" type="button" title="恢复默认字号（18px）" aria-label="当前字号 18px，恢复默认字号" disabled>18px</button>
      <button id="source-font-increase" type="button" title="放大代码字号" aria-label="放大代码字号" disabled>A+</button>
      <button id="source-copy" type="button" title="复制完整源码" disabled>复制代码</button>
    `;
    const pane = this.elements.editor.parentElement;
    pane.classList.add("source-pane--toolbar");
    pane.prepend(toolbar);
    this.elements.fontDecrease = toolbar.querySelector("#source-font-decrease");
    this.elements.fontReset = toolbar.querySelector("#source-font-reset");
    this.elements.fontIncrease = toolbar.querySelector("#source-font-increase");
    this.elements.copySource = toolbar.querySelector("#source-copy");
    this.elements.copyStatus = toolbar.querySelector("#source-copy-status");
    this.elements.fontDecrease.addEventListener("click", () => this.setSourceFontSize(this.sourceFontSize - 2));
    this.elements.fontIncrease.addEventListener("click", () => this.setSourceFontSize(this.sourceFontSize + 2));
    this.elements.fontReset.addEventListener("click", () => this.setSourceFontSize(18));
    this.elements.copySource.addEventListener("click", () => this.copySource());
  }

  setSourceFontSize(value) {
    this.sourceFontSize = Math.max(12, Math.min(32, value));
    this.editor.setFontSize(this.sourceFontSize);
    this.editor.resize(true);
    this.elements.fontReset.textContent = `${this.sourceFontSize}px`;
    this.elements.fontReset.setAttribute("aria-label", `当前字号 ${this.sourceFontSize}px，恢复默认字号`);
    this.elements.fontReset.disabled = false;
    this.elements.fontDecrease.disabled = this.sourceFontSize <= 12;
    this.elements.fontIncrease.disabled = this.sourceFontSize >= 32;
    try {
      localStorage.setItem("dsa-source-font-size", String(this.sourceFontSize));
    } catch { /* Keep the current size even when it cannot be persisted. */ }
  }

  async copySource() {
    const button = this.elements.copySource;
    const status = this.elements.copyStatus;
    window.clearTimeout(this.copyFeedbackTimer);
    button.disabled = true;
    status.textContent = "正在复制…";
    const source = this.editor.getValue();
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(source);
        copied = true;
      }
    } catch { /* Try the selection-based fallback when clipboard access is denied. */ }
    if (!copied) {
      const focused = document.activeElement;
      const textarea = document.createElement("textarea");
      textarea.className = "source-copy-buffer";
      textarea.value = source;
      textarea.readOnly = true;
      textarea.setAttribute("aria-label", "待复制源码");
      document.body.appendChild(textarea);
      try {
        textarea.select();
        copied = document.execCommand("copy");
      } catch { /* Report failure locally without interrupting the animation. */ }
      finally {
        textarea.remove();
        focused?.focus({ preventScroll: true });
      }
    }
    button.disabled = false;
    status.textContent = copied ? "已复制" : "复制失败，请选中代码复制";
    status.classList.toggle("source-copy-status--error", !copied);
    if (copied) {
      this.copyFeedbackTimer = window.setTimeout(() => { status.textContent = ""; }, 2500);
    }
  }

  setFrames(frames) {
    if (!Array.isArray(frames) || frames.length === 0) {
      throw new Error("演示没有生成可播放帧。");
    }
    if (frames.some((frame) => !frame || !("status" in frame))) {
      throw new Error("演示生成了无效帧数据。");
    }

    this.frames = frames;
    this.frameIndex = 0;
    this.elements.frameRange.min = "1";
    this.elements.frameRange.max = String(frames.length);
    this.elements.frameRange.value = "1";
    this.elements.frameRange.disabled = frames.length <= 1;
    this.elements.play.disabled = frames.length <= 1 && !this.isContinuousDemonstration();
    root.dataset.demoFrameTotal = String(frames.length);
    this.updateControlState();
  }

  bindControls() {
    this.elements.speedRange.addEventListener("input", () => {
      this.setSpeed(Number(this.elements.speedRange.value));
    });
    this.elements.speedUp.addEventListener("click", () => this.setSpeed(this.speed + 10));
    this.elements.speedDown.addEventListener("click", () => this.setSpeed(this.speed - 10));
    this.elements.play.addEventListener("click", () => this.togglePlayback());
    this.elements.reset.addEventListener("click", () => this.reset());
    this.elements.previous.addEventListener("click", () => this.seekFromUser(this.frameIndex - 1));
    this.elements.next.addEventListener("click", () => this.seekFromUser(this.frameIndex + 1));
    this.elements.frameRange.addEventListener("input", () => {
      this.seekFromUser(Number(this.elements.frameRange.value) - 1);
    });
    window.addEventListener("demo:reinitialize", () => this.reinitialize());
  }

  bindDialogs() {
    document.querySelectorAll("[data-dialog]").forEach((trigger) => {
      const dialog = document.querySelector(`#${trigger.dataset.dialog}`);
      trigger.addEventListener("click", () => dialog.showModal());
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  setSpeed(value) {
    this.speed = Math.max(1, Math.min(100, value));
    this.elements.speedRange.value = String(this.speed);
    this.elements.speedOutput.value = `${this.speed}%`;
    this.elements.speedOutput.textContent = `${this.speed}%`;

    if (window.demoAdapter && typeof window.demoAdapter.setSpeed === "function") {
      window.demoAdapter.setSpeed(this.speed);
    }

    if (this.playing) this.scheduleNextFrame();
  }

  frameDuration() {
    return Math.round(2500 - ((this.speed - 1) / 99) * 2000);
  }

  togglePlayback() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isContinuousDemonstration()) {
      this.playing = true;
      window.demoAdapter.play();
      this.updateControlState();
      return;
    }
    if (this.frames.length <= 1) return;
    if (this.frameIndex === this.frames.length - 1) this.renderFrame(0, 0);
    this.playing = true;
    this.updateControlState();
    this.scheduleNextFrame();
  }

  pause() {
    this.playing = false;
    window.clearTimeout(this.timer);
    this.timer = null;
    if (this.isContinuousDemonstration()) window.demoAdapter.pause();
    this.updateControlState();
  }

  scheduleNextFrame() {
    window.clearTimeout(this.timer);
    if (!this.playing) return;

    if (this.frameIndex >= this.frames.length - 1) {
      this.pause();
      return;
    }

    const duration = this.frameDuration();
    this.timer = window.setTimeout(() => {
      try {
        this.renderFrame(this.frameIndex + 1, duration);
        if (this.frameIndex >= this.frames.length - 1) {
          this.pause();
        } else {
          this.scheduleNextFrame();
        }
      } catch (error) {
        this.pause();
        this.fail(error);
      }
    }, duration);
  }

  seekFromUser(index) {
    this.pause();
    this.renderFrame(index, Math.min(this.frameDuration(), 350));
  }

  reset() {
    this.pause();
    if (window.demoAdapter && typeof window.demoAdapter.reset === "function") {
      window.demoAdapter.reset();
    }
    this.renderFrame(0, 0);
  }

  isContinuousDemonstration() {
    return Boolean(window.demoAdapter && window.demoAdapter.continuous);
  }

  renderFrame(index, duration) {
    const nextIndex = Math.max(0, Math.min(this.frames.length - 1, index));
    const frame = this.frames[nextIndex];
    window.render(frame.status, duration);
    this.frameIndex = nextIndex;
    this.highlightSource(frame.hls, frame.hlt);
    this.rebuildNarration();
    this.updateControlState();
    root.dataset.demoFrame = String(nextIndex + 1);
  }

  highlightSource(start, end) {
    if (!this.editor) return;
    if (this.marker !== null) this.editor.session.removeMarker(this.marker);
    this.marker = null;

    const firstLine = Number(start);
    const lastLine = Number(end);
    if (!Number.isFinite(firstLine) || firstLine < 1) return;

    const Range = window.ace.require("ace/range").Range;
    const finalLine = Number.isFinite(lastLine) && lastLine >= firstLine ? lastLine : firstLine;
    this.marker = this.editor.session.addMarker(
      new Range(firstLine - 1, 0, finalLine - 1, 1),
      "demo-active-line",
      "fullLine"
    );
    this.editor.gotoLine(firstLine, 0, true);
  }

  rebuildNarration() {
    const fragment = document.createDocumentFragment();
    this.frames.slice(0, this.frameIndex + 1).forEach((frame) => {
      const message = typeof frame.log === "string" ? frame.log.trim() : "";
      if (!message) return;
      const item = document.createElement("li");
      item.textContent = message;
      fragment.appendChild(item);
    });

    this.elements.logList.replaceChildren(fragment);
    this.elements.logger.scrollTop = this.elements.logger.scrollHeight;
  }

  updateControlState() {
    const total = this.frames.length || 1;
    const current = this.frameIndex + 1;
    this.elements.frameRange.value = String(current);
    this.elements.frameOutput.value = `${current} / ${total}`;
    this.elements.frameOutput.textContent = `${current} / ${total}`;
    this.elements.previous.disabled = current <= 1;
    this.elements.next.disabled = current >= total;
    this.elements.play.setAttribute("aria-label", this.playing ? "暂停" : "播放");
    this.elements.play.title = this.playing ? "暂停" : "播放";
    this.elements.playIcon.classList.toggle("icon-bofang", !this.playing);
    this.elements.playIcon.classList.toggle("icon-zanting", this.playing);
  }

  reinitialize() {
    try {
      this.pause();
      const generatedFrames = window.lineExports.init();
      const nextFrames = generatedFrames.slice(this.generatedFrameCount);
      this.generatedFrameCount = generatedFrames.length;
      this.setFrames(nextFrames.length > 0 ? nextFrames : generatedFrames);
      this.renderFrame(0, 0);
    } catch (error) {
      this.fail(error);
    }
  }

  setState(state, label) {
    root.dataset.demoState = state;
    this.elements.runtimeStatus.textContent = label;
    if (state === "ready") this.elements.sceneStatus.hidden = true;
  }

  fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    this.pause();
    this.setState("error", "加载失败");
    this.elements.sceneStatus.hidden = false;
    this.elements.sceneStatus.classList.add("scene-status--error");
    this.elements.sceneStatus.textContent = message;
    root.dataset.demoError = message;
  }

  waitForLayout() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }
}

const player = new DemonstrationPlayer();
window.demoPlayer = player;
window.addEventListener("error", (event) => {
  if (root.dataset.demoState !== "error") player.fail(event.error || event.message);
});
window.addEventListener("unhandledrejection", (event) => player.fail(event.reason));
player.initialize();
