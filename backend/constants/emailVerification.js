const emailVerification = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Email Verified Successfully!</title>
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 900px;
    margin: 30px auto;
    background: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  h1 {
    color: #28a745; /* Green for success */
    text-align: center;
    margin-bottom: 20px;
  }
  p {
    text-align: center;
    font-size: 1.1em;
    margin-bottom: 15px;
  }
  .button {
    display: block;
    width: 200px;
    margin: 25px auto;
    padding: 12px 20px;
    background-color: #007bff; /* Blue button */
    color: #ffffff;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
  }
  .footer {
    text-align: center;
    margin-top: 30px;
    font-size: 0.8em;
    color: #777;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>🎉რეგისტრაცია წარმათებით გაიარეთ🎉</h1>
    <p>თქვენ შეგიძლიათ გამოიყენოთ გრაგნილი</p>
    <p>დასაწყებად, გაიარეთ ავტორიზაცია მოცემულ ლინკზე</p>
    <a href="https://gragnily.vercel.app/login" class="button">ავტორიზაცია</a>
    <p>კითხვების შემთხვევაში დაგვიკავშირდით: gragnily@gmail.com</p>
    <div class="footer">
      <p>მადლობთ რომ ხართ ჩვენი ქომუნითის ნაწილი!</p>
      <p>&copy; 2025 Gragnily</p>
    </div>
  </div>
</body>
</html>`;

module.exports = { emailVerification };
