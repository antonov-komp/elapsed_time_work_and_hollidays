<?php
// Разрешаем загрузку в iframe для Bitrix24
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
// Не устанавливаем X-Frame-Options, чтобы разрешить загрузку в iframe из Bitrix24

// Логирование для отладки
error_log('Placement called: ' . print_r($_REQUEST, true));

require_once (__DIR__.'/crest.php');

function displayValue($value) {
	if (is_array($value)) {
		$result = '';
		foreach ($value as $item) {
			if (is_array($item)) {
				$result .= print_r($item, true) . ', ';
			} else {
				$result .= $item . ', ';
			}
		}
		return rtrim($result, ', ');
	} else {
		return $value;
	}
}

?>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="css/app.css">
	<script
		src="https://code.jquery.com/jquery-3.6.0.js"
		integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
		crossorigin="anonymous"></script>

	<title>Placement</title>
</head>
<body class="container-fluid">
<div class="alert alert-success" role="alert"><pre>
	<?php
	print_r($_REQUEST);
	?>
	</pre>
</div>
<?php
// Проверка наличия PLACEMENT_OPTIONS
if (!isset($_REQUEST['PLACEMENT_OPTIONS']) || empty($_REQUEST['PLACEMENT_OPTIONS'])) {
	?>
	<div class="alert alert-warning" role="alert">
		<strong>Внимание:</strong> PLACEMENT_OPTIONS не найден. Эта страница должна вызываться из Bitrix24 placement.
	</div>
	<?php
} else {
	$placement_options = json_decode($_REQUEST['PLACEMENT_OPTIONS'], true);

	// Получаем данные текущего пользователя
	// Для USER_PROFILE_TOOLBAR можно использовать user.current или user.get
	$user = CRest::call('user.current');

	if (empty($user['error']) && !empty($user['result'])) {
		?>
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Поле</th>
					<th>Значение</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($user['result'] as $field => $value): ?>
					<tr>
						<td><strong><?php echo htmlspecialchars($field); ?></strong></td>
						<td><?php echo htmlspecialchars(displayValue($value)); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<?php
	} elseif (!empty($user['error'])) {
		?>
		<div class="alert alert-danger" role="alert">
			<strong>Ошибка:</strong> <?php echo htmlspecialchars($user['error']); ?>
			<?php if (!empty($user['error_description'])): ?>
				<br><?php echo htmlspecialchars($user['error_description']); ?>
			<?php endif; ?>
		</div>
		<?php
	}
}
?>
</body>
</html>
