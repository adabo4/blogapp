import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';
import expressEjsLayouts from "express-ejs-layouts";
import * as cheerio from "cheerio";
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFile = path.join(__dirname, "data", "posts.json");

let posts = [];

if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
}

const app = express();

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "layout");
app.use(express.static("public"));
app.use(methodOverride('_method'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const defaultImages = fs.readdirSync(path.join(__dirname, 'public/img/defaults'));

function getRandomDefaultImage() {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return `/img/defaults/${defaultImages[randomIndex]}`;
}

app.get("/", (req, res) => {
    res.render("index", { title: "Home", posts });
});

app.get("/create-post", (req, res) => {
    res.render("createPost", { title: "Create Post" });
});

app.get("/post-detail/:id", (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.render("postDetail", { title: "Post Detail", post });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/", (req, res) => {
    const { title, author, tags, summary, content, summaryImage } = req.body;


    const $ = cheerio.load(content);
    $("img").remove();
    const textOnlyContent = $.text().trim();

    const id = uuidv4();

    const imageToUse = summaryImage || getRandomDefaultImage();

    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];


    const newPost = { id, title, author, tags: tagArray, summary, content, textOnlyContent: textOnlyContent || '', summaryImage: imageToUse };

    posts.push(newPost);

    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.render("index", { title: "Create Post", posts });
});

app.post('/upload-image', (req, res) => {
    const { base64Image, fileName } = req.body;
    const imageBuffer = Buffer.from(base64Image, 'base64');  // Decode base64 string

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);  // Create uploads directory if it doesn't exist
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            return res.status(500).send('Failed to save image');
        }

        res.status(200).send({
            imageUrl: `/uploads/${fileName}`
        });
    });
});

app.get("/create-post/:id", (req, res) => {
    const postID = req.params.id;
    let post = posts.find((post) => postID === post.id)
    res.render("createPost", { title: "Edit Post", post })
})

app.patch("/post-detail/:id", (req, res) => {

    const { title, author, tags, summary, content, summaryImage } = req.body;

    const postId = req.params.id;
    const imageToUse = summaryImage || getRandomDefaultImage();

    console.log("This is summary Image: " + summaryImage)


    let postIndex = posts.findIndex((post) => postId === post.id)

    if (postIndex !== -1) {

        const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        posts[postIndex] = {
            ...posts[postIndex],
            title,
            author,
            tags: tagArray,
            summary,
            content,
            summaryImage: imageToUse
        }



        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

        res.redirect(`/post-detail/${postId}`);
    } else {
        res.status(404).send("Post not found");
    }

})

const PORT = 3000;

app.listen(PORT, () => { console.log(`Listening on port ${PORT}, http://localhost:${PORT}`) });
