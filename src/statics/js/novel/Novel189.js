_pumd.Novel189 = (function (window, ptk) {
  let browser = ptk.getBrowser();

  function NovelToolkit() {
    this.context;

    this.container;

    this.wrapper;

    this.downloadBtn;

    this.epubMaker;

    this.toolkitWrapper;
  }

  NovelToolkit.prototype = {
    setContext: function (context) {
      this.context = context;
    },

    setContainer: function (container) {
      this.container = container;
    },

    init: function () {
      if (!this.wrapper) {
        this.createWrapper();
      }

      this.downloadNovel();
    },

    createWrapper: function () {
      var downloadBtn = this.createDownloadBtn();

      this.wrapper = document.createElement('div');
      this.wrapper.setAttribute('id', '__ptk-novel');
      this.wrapper.style = 'display:block;'
      downloadBtn.appendTo(this.wrapper);

      this.container.appendChild(this.wrapper);
      return;
    },

    createDownloadBtn: function () {
      this.downloadBtn = new ptk.Component.Button(ptk.common.lan.msg('download_novel'), 'background:#0096fa;color:#fff;padding:3px 5px;border-radius:3px;font-weight:700;font-size:12px');
      return this.downloadBtn;
    },

    hide: function () {
      console.log('hide');
      this.wrapper.remove();
      this.wrapper = null;
    },

    getEpubMaker: function () {
      return new EpubMaker()
        .withUuid(this.context.novelUrl)
        .withTemplate('idpf-wasteland')
        .withAuthor(this.context.novelUserName)
        .withAttributionUrl(this.context.novelUrl)
        .withCover(this.context.novelCover)
        .withTitle(this.context.novelTitle);
    },

    writeSections: function () {
      let self = this;

      this.context.novelSections.forEach(function (section) {
        self.epubMaker.withSection(
          new EpubMaker.Section('bodymatter', null, { content: section }, false, false)
        );
      });
    },

    downloadNovel: function () {
      let self = this;

      this.epubMaker = this.getEpubMaker();

      this.writeSections();

      this.epubMaker.downloadEpub(function (epubZipContent, filename) {
        self.downloadBtn.setAttribute('href', URL.createObjectURL(epubZipContent));
        self.downloadBtn.setAttribute('download', filename);
      });
    }
  }

  NovelToolkit.instance;

  NovelToolkit.getInstance = function (container, context) {
    if (!NovelToolkit.instance) {
      NovelToolkit.instance = new NovelToolkit();
    }

    NovelToolkit.instance.setContainer(container);
    NovelToolkit.instance.setContext(context);

    return NovelToolkit.instance;
  };

  return NovelToolkit;
})(window, _pumd);
