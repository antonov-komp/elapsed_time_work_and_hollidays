<?php
require_once (__DIR__.'/crest.php');

$install_result = CRest::installApp();

// Регистрация placement только после успешной установки
if($install_result['install'] === true)
{
	// embedded for placement "placement.php"
	$handlerBackUrl = ($_SERVER['HTTPS'] === 'on' || $_SERVER['SERVER_PORT'] === '443' ? 'https' : 'http') . '://'
		. $_SERVER['SERVER_NAME']
		. (in_array($_SERVER['SERVER_PORT'],	['80', '443'], true) ? '' : ':' . $_SERVER['SERVER_PORT'])
		. str_replace($_SERVER['DOCUMENT_ROOT'], '',__DIR__)
		. '/placement.php';

	// Сначала пытаемся удалить старый placement (если существует)
	CRest::call(
		'placement.unbind',
		[
			'PLACEMENT' => 'USER_PROFILE_TOOLBAR',
			'HANDLER' => $handlerBackUrl
		]
	);

	// Регистрируем новый placement
	$result = CRest::call(
		'placement.bind',
		[
			'PLACEMENT' => 'USER_PROFILE_TOOLBAR',
			'HANDLER' => $handlerBackUrl,
			'TITLE' => 'Мой Ежемесячный табель присутствия'
		]
	);

	// Логируем URL и результат
	CRest::setLog([
		'user_profile_toolbar' => $result,
		'handler_url' => $handlerBackUrl,
		'server_vars' => [
			'HTTPS' => $_SERVER['HTTPS'] ?? 'off',
			'SERVER_NAME' => $_SERVER['SERVER_NAME'] ?? '',
			'SERVER_PORT' => $_SERVER['SERVER_PORT'] ?? '',
			'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? '',
			'__DIR__' => __DIR__
		]
	], 'installation');
}

if($install_result['rest_only'] === false): ?>
<head>
	<script src="//api.bitrix24.com/api/v1/"></script>
	<?php if($install_result['install'] == true): ?>
	<script>
		BX24.init(function(){
			BX24.installFinish();
		});
	</script>
	<?php endif; ?>
</head>
<body>
	<?php if($install_result['install'] == true): ?>
		installation has been finished
	<?php else: ?>
		installation error
	<?php endif; ?>
</body>
<?php endif; ?>
