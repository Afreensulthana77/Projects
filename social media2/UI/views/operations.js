import mysql from 'mysql2';

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: "root",
    password: "kiranmai",
    database: "social_media"
}).promise();

export async function readPosts() {
    const output = await connection.query("select * from posts");
    return output[0];
}

export async function readUser(profile) {
    const output = await connection.query("select * from users where profile = ?", [profile]);
    return output[0];
}

export async function insertUser(name, profile, password, headline) {
    await connection.query("insert into users(name, profile, password, headline) values (?, ?, ?, ?)", [name, profile, password, headline]);
}

export async function insertPosts(profile, content, likes, shares) {
    await connection.query("insert into posts(profile, content, likes, shares) values (?, ?, ?, ?)", [profile, content, likes, shares]);
}

export async function likeFun(content) {
    const output = await connection.query("select likes from posts where content = ?", [content]);
    const likes = output[0][0].likes;
    const incLikes = likes + 1;
    await connection.query("update posts set likes = ? where content = ?", [incLikes, content]);
}

export async function shareFun(content) {
    const output = await connection.query("select shares from posts where content = ?", [content]);
    const shares = output[0][0].shares;
    const incShares = shares + 1;
    await connection.query("update posts set shares = ? where content = ?", [incShares, content]);
}

export async function deleteFun(content) {
    await connection.query("delete from posts where content = ?", [content]);
}
 123 changes: 123 additions & 0 deletions123  
views/Posts.hbs
@@ -0,0 +1,123 @@
<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <title>Posts</title>
    <style>
        form {
            display: inline;
        }
    </style>

</head>

<body>
    <div class="container-fluid row mt-4">
        <div class="col-4">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h3 class="card-title">John Doe</h3>
                    <p>@johndoe</p>
                    <p class="card-text">Web Developer</p>
                </div>
                <div>
                    <button type="button" class="btn btn-primary m-3" data-toggle="modal" data-target="#exampleModal"
                        data-whatever="@mdo">Create Post</button>

                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Let's Create a Post</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form action="/addposts" method="post">
                                        <div class="form-group">
                                            <input type="hidden" name="profile" value="johndoe">
                                            <label for="message-text" class="col-form-label">Message:</label>
                                            <textarea class="form-control" name="content" id="message-text"></textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-dismiss="modal">Close</button>
                                            <button type="submit" class="btn btn-primary">Post</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-8">
            <!-- Example post data -->
            {{#each data}}
            <div class="card m-2">
                <div class="media text-muted pt-3 m-3">
                    <img data-src="holder.js/32x32?theme=thumb&amp;bg=007bff&amp;fg=007bff&amp;size=1"
                        alt="32x32" class="mr-2 rounded" style="width: 32px; height: 32px;"
                        src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1890c99d6fe%20text%20%7B%20fill%3A%23007bff%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A2pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1890c99d6fe%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23007bff%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2211.836840629577637%22%20y%3D%2216.960000014305116%22%3E32x32%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                        data-holder-rendered="true">
                    <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                        <strong class="d-block text-gray-dark">@johndoe</strong>
                    </p>
                </div>
                <div class="card-body">
                    <p class="card-text">{{this.content}}</p>
                </div>
                <span class="m-3">
                    <form action="/like" method="post">
                        <input type="hidden" name="content" value="{{this.content}}">
                        <button type="submit" class="btn btn-danger">Like</button>
                    </form>
                    {{#if this.likes}}
                    <button type="button" disabled class="btn btn-primary">{{this.likes}} Likes</button>
                    {{else}}
                    <button type="button" disabled class="btn btn-primary">0 Likes</button>
                    {{/if}}
                    <form action="/share" method="post">
                        <input type="hidden" name="content" value="{{this.content}}">
                        <button type="submit" class="btn btn-success">Share</button>
                    </form>
                    {{#if this.shares}}
                    <button type="button" disabled class="btn btn-primary">{{this.shares}} Shares</button>
                    {{else}}
                    <button type="button" disabled class="btn btn-primary">0 Shares</button>
                    {{/if}}
                    <form action="/delete" method="post">
                        <input type="hidden" name="content" value="{{this.content}}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </span>
            </div>
            {{/each}}
        </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
</body>

</html>