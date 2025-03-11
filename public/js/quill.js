document.addEventListener("DOMContentLoaded", function () {
    const fontFamilyArr = ["Roboto Condensed", "Times New Roman", "Calibri", "Calibri-Light", "Sans-Serif", 'Roboto', 'Inter'];
    const emptyFontSizeArr = [];
    const fullFontSizeArr = pushToArr(emptyFontSizeArr)
    const fontSizeArr = fullFontSizeArr;

    function pushToArr(arr) {
        for (let i = 10; i < 34; i += 2) {

            arr.push(i + "px");
        }
        return arr;
    }

    const fonts = Quill.import('attributors/style/font');
    const size = Quill.import('attributors/style/size');
    fonts.whitelist = fontFamilyArr;
    size.whitelist = fontSizeArr;
    Quill.register(fonts, true);
    Quill.register(size, true);

    let toolBarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{ font: fontFamilyArr }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: +1 }, { indent: -1 }],
        [{ align: [] }],
        [{ size: fontSizeArr }],
        ["image", "link", "video", "formula"],
        [{ color: [] }, { background: [] }]
    ];

    const options = {
        debug: 'info',
        modules: {
            toolbar: toolBarOptions,
        },
        placeholder: 'Write your text here...',
        theme: 'snow'
    };


    const quill = new Quill('#editor', options);

    function updatePostAbout() {
        let postSummaryElement = document.querySelector('.post-about');
        const summary = post.summary || '';
        const content = post.content || '';

        if (summary) {
            postSummaryElement.innerHTML = summary;
        } else {
            if (content.length > 150) {
                postSummaryElement.innerHTML = content.slice(0, 150) + '...';

            } else {
                postSummaryElement.innerHTML = content
            }
        }
    }

    var imageHandler = function () {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            var file = input.files[0];
            var reader = new FileReader();

            reader.onloadend = function () {
                var base64Image = reader.result;

                fetch('/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        base64Image: base64Image.split(',')[1],
                        fileName: file.name
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        var imageUrl = data.imageUrl;
                        var range = quill.getSelection();
                        quill.insertEmbed(range.index, 'image', imageUrl);

                    })
                    .catch(err => console.error('Image upload failed', err));
            };

            reader.readAsDataURL(file);
        };
    };

    quill.getModule('toolbar').addHandler('image', imageHandler);

    document.querySelector('form').onsubmit = function () {
        let fullContent = quill.root.innerHTML;

        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = fullContent;
        tempDiv.querySelectorAll("img").forEach(img => img.remove());

        let textOnlyContent = tempDiv.textContent.trim();

        document.getElementById('hiddenContent').value = fullContent;

        let summaryInput = document.querySelector('input[name="summary"]');

        if (!summaryInput.value.trim()) {
            summaryInput.value = textOnlyContent.substring(0, 150);
        }
    };

    updatePostAbout();
});
