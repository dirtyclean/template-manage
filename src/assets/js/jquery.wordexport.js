import 'file-saver'
if (typeof jQuery !== 'undefined' && typeof saveAs !== 'undefined') {
  ;(function ($) {
    $.fn.wordExport = function (fileName) {
      fileName = typeof fileName !== 'undefined' ? fileName : 'jQuery-Word-Export'
      const statics = {
        mhtml: {
          top:
            'Mime-Version: 1.0\nContent-Base: ' +
            location.href +
            '\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location: ' +
            location.href +
            '\n\n<!DOCTYPE html>\n<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">\n_html_</html>',
          head:
            '<head><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:GrammarState>Clean</w:GrammarState><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n</head>\n',
          body: `<body>
                  <div class="WordSection1">_body_</div>
                  <div class="page-number-wrap">  
                    <!-- 最外层，页脚在这个class下包着才显示 -->
                    <!-- 页脚开始 -->
                    <div style="mso-element:footer" id="footer">
                      <p class="MsoFooter">
                        —&nbsp;<span style="mso-field-code: PAGE;font-family:Times New Roman"></span>&nbsp;—
                      </p>
                    </div>
                    <!-- 页脚结束 -->
                  </div>
                </body>`
        }
      }
      const options = {
        maxWidth: 624
      }
      // Clone selected element before manipulating it
      const markup = $(this).clone()

      // Remove hidden elements from the output
      markup.each(function () {
        const self = $(this)
        if (self.is(':hidden')) {
          self.remove()
        }
      })

      // Embed all images using Data URLs
      const images = []
      const img = markup.find('img')
      for (let i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        const w = Math.min(img[i].width, options.maxWidth)
        const h = img[i].height * (w / img[i].width)
        // Create canvas for converting image to data URL
        const canvas = document.createElement('CANVAS')
        canvas.width = w
        canvas.height = h
        // Draw image to canvas
        const context = canvas.getContext('2d')
        context.drawImage(img[i], 0, 0, w, h)
        // Get data URL encoding of image
        const uri = canvas.toDataURL('image/png/jpg')
        $(img[i]).attr('src', img[i].src)
        img[i].width = w
        img[i].height = h
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
          encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
          location: $(img[i]).attr('src'),
          data: uri.substring(uri.indexOf(',') + 1)
        }
      }

      // Prepare bottom of mhtml file with image data
      let mhtmlBottom = '\n'
      for (let i = 0; i < images.length; i++) {
        mhtmlBottom += '--NEXT.ITEM-BOUNDARY\n'
        mhtmlBottom += 'Content-Location: ' + images[i].location + '\n'
        mhtmlBottom += 'Content-Type: ' + images[i].type + '\n'
        mhtmlBottom += 'Content-Transfer-Encoding: ' + images[i].encoding + '\n\n'
        mhtmlBottom += images[i].data + '\n\n'
      }
      mhtmlBottom += '--NEXT.ITEM-BOUNDARY--'

      // TODO: load css from included stylesheet

      // const styles = ' /* Font Definitions */@font-face{font-family:宋体;panose-1:2 1 6 0 3 1 1 1 1 1;mso-font-alt:SimSun;mso-font-charset:134;mso-generic-font-family:auto;mso-font-pitch:variable;mso-font-signature:3 680460288 22 0 262145 0;}  @font-face{font-family:"Cambria Math";panose-1:2 4 5 3 5 4 6 3 2 4;mso-font-charset:1;mso-generic-font-family:roman;mso-font-format:other;mso-font-pitch:variable;mso-font-signature:0 0 0 0 0 0;}  @font-face{font-family:"\@宋体";panose-1:2 1 6 0 3 1 1 1 1 1;mso-font-charset:134;mso-generic-font-family:auto;mso-font-pitch:variable;mso-font-signature:3 680460288 22 0 262145 0;}/* Style Definitions */p.MsoNormal, li.MsoNormal, div.MsoNormal{mso-style-unhide:no;mso-style-qformat:yes;mso-style-parent:"";margin:0cm;margin-bottom:.0001pt;mso-pagination:widow-orphan;font-size:14.0pt;font-family:宋体;mso-bidi-font-family:宋体;}p.MsoHeader, li.MsoHeader, div.MsoHeader{mso-style-noshow:yes;mso-style-priority:99;mso-style-link:"页眉 Char";margin:0cm;margin-bottom:.0001pt;text-align:center;mso-pagination:widow-orphan;layout-grid-mode:char;font-size:9.0pt;font-family:宋体;mso-bidi-font-family:宋体;}p.MsoFooter, li.MsoFooter, div.MsoFooter{mso-style-noshow:yes;mso-style-priority:99;mso-style-link:"页脚 Char";margin:0cm;margin-bottom:.0001pt;mso-pagination:widow-orphan;layout-grid-mode:char;font-size:9.0pt;font-family:宋体;mso-bidi-font-family:宋体;}p.MsoAcetate, li.MsoAcetate, div.MsoAcetate{mso-style-noshow:yes;mso-style-priority:99;mso-style-link:"批注框文本 Char";margin:0cm;margin-bottom:.0001pt;mso-pagination:widow-orphan;font-size:9.0pt;font-family:宋体;mso-bidi-font-family:宋体;}span.Char{mso-style-name:"页眉 Char";mso-style-noshow:yes;mso-style-priority:99;mso-style-unhide:no;mso-style-locked:yes;mso-style-link:页眉;font-family:宋体;mso-ascii-font-family:宋体;mso-fareast-font-family:宋体;mso-hansi-font-family:宋体;}span.Char0{mso-style-name:"页脚 Char";mso-style-noshow:yes;mso-style-priority:99;mso-style-unhide:no;mso-style-locked:yes;mso-style-link:页脚;font-family:宋体;mso-ascii-font-family:宋体;mso-fareast-font-family:宋体;mso-hansi-font-family:宋体;}span.Char1{mso-style-name:"批注框文本 Char";mso-style-noshow:yes;mso-style-priority:99;mso-style-unhide:no;mso-style-locked:yes;mso-style-link:批注框文本;font-family:宋体;mso-ascii-font-family:宋体;mso-fareast-font-family:宋体;mso-hansi-font-family:宋体;}p.msochpdefault, li.msochpdefault, div.msochpdefault{mso-style-name:msochpdefault;mso-style-unhide:no;mso-margin-top-alt:auto;margin-right:0cm;mso-margin-bottom-alt:auto;margin-left:0cm;mso-pagination:widow-orphan;font-size:10.0pt;font-family:宋体;mso-bidi-font-family:宋体;}span.msonormal0{mso-style-name:msonormal;mso-style-unhide:no;}.MsoChpDefault{mso-style-type:export-only;mso-default-props:yes;font-size:10.0pt;mso-ansi-font-size:10.0pt;mso-bidi-font-size:10.0pt;mso-ascii-font-family:"Times New Roman";mso-hansi-font-family:"Times New Roman";mso-font-kerning:0pt;}/* Page Definitions */  @page WordSection1{size:595.3pt 841.9pt;margin:72.0pt 90.0pt 72.0pt 90.0pt;mso-header-margin:42.55pt;mso-footer-margin:49.6pt;mso-paper-source:0;}div.WordSection1{page:WordSection1;}';
      // mso-title-page:yes; // 首页不显示页眉页脚,比如第一页是封面时
      // mso-page-numbers:0; // 起始页码从0开始,设置开始页码
      const styles = `@page WordSection1{size:608pt 841.9pt;margin:105.0pt 78.75pt 105.0pt 78.75pt;mso-header-margin:42.55pt;mso-footer-margin:49.6pt;mso-paper-source:0;}
                      div.WordSection1{page:WordSection1;}
                      .page-number-wrap{mso-footer: footer;mso-title-page:no;mso-paper-source:0; mso-page-numbers:1;}
                      .MsoFooter{margin:0in;margin-bottom:.0001pt;mso-pagination:widow-orphan;tab-stops:center 3.0in right 6.0in;font-size:12.0pt;text-align:right}`

      // Aggregate parts of the file together
      const fileContent =
        statics.mhtml.top.replace(
          '_html_',
          statics.mhtml.head.replace('_styles_', styles) + statics.mhtml.body.replace('_body_', markup.html())
        ) + mhtmlBottom

      // Create a Blob with the file contents
      const blob = new Blob([fileContent], {
        type: 'application/msword;charset=utf-8'
      })
      /* global saveAs */
      saveAs(blob, fileName + '.doc')
    }
    /* global jQuery */
  })(jQuery)
} else {
  if (typeof jQuery === 'undefined') {
    console.error('jQuery Word Export: missing dependency (jQuery)')
  }
  if (typeof saveAs === 'undefined') {
    console.error('jQuery Word Export: missing dependency (FileSaver.js)')
  }
}
