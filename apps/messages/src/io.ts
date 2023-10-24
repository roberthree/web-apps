export function io_page_html_string(): string {
	return `
<!DOCTYPE html>
<html>
<head>
<title>Messages IO</title>
</head>
<body>
<h1>Messages IO</h1>

<div>
<h2>Manage user</h2>
<form method="post">
<table>
<tr>
<td align="right">username:</td>
<td align="left"><input type="text" id="username" name="username"></td>
</tr>
<tr>
<td align="right">password:</td>
<td align="left"><input type="text" id="password" name="password"></td>
</tr>
</table>
<input type="submit" formaction="/signup" value="signup">
<input type="submit" formaction="/remove" value="remove">
<input type="submit" formaction="/access" value="access">
</form>
</div>

<div>
<h2>Send message</h2>
<form method="post">
<table>
<tr>
<td align="right">recipient:</td>
<td align="left"><input type="text" id="recipient" name="recipient"></td>
</tr>
<tr>
<td align="right">message:</td>
<td align="left"><input type="text" id="message" name="message"></td>
</tr>
</table>
<input type="submit" formaction="/send" value="send">
</form>
</div>

</body>
</html>
	`
}