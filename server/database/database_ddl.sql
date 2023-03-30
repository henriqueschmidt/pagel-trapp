CREATE DATABASE IF NOT EXISTS `pagel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u494844533_gHjzP`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `atividade_tipos`
--

CREATE TABLE `atividade_tipos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `execucoes`
--

CREATE TABLE `execucoes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `nome` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `limite_dt` datetime NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `executante_id` bigint(20) UNSIGNED NOT NULL,
  `tarefa_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `filiais`
--

CREATE TABLE `filiais` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfil_permissao`
--

CREATE TABLE `perfil_permissao` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `perfil_id` bigint(20) UNSIGNED NOT NULL,
  `permissao_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `perfil_permissao`
--

INSERT INTO `perfil_permissao` (`id`, `perfil_id`, `permissao_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 2, NULL, NULL),
(3, 1, 3, NULL, NULL),
(4, 1, 4, NULL, NULL),
(5, 1, 5, NULL, NULL),
(6, 1, 6, NULL, NULL),
(7, 1, 7, NULL, NULL),
(8, 1, 8, NULL, NULL),
(9, 1, 9, NULL, NULL),
(10, 1, 10, NULL, NULL),
(11, 1, 11, NULL, NULL),
(12, 1, 12, NULL, NULL),
(13, 2, 1, NULL, NULL),
(14, 2, 2, NULL, NULL),
(15, 2, 3, NULL, NULL),
(16, 2, 4, NULL, NULL),
(17, 2, 5, NULL, NULL),
(18, 2, 6, NULL, NULL),
(19, 2, 7, NULL, NULL),
(20, 2, 8, NULL, NULL),
(21, 2, 9, NULL, NULL),
(22, 2, 10, NULL, NULL),
(23, 3, 10, NULL, NULL),
(24, 3, 12, NULL, NULL),
(25, 4, 10, NULL, NULL),
(26, 4, 11, NULL, NULL),
(27, 4, 12, NULL, NULL),
(28, 5, 10, NULL, NULL),
(29, 5, 11, NULL, NULL),
(30, 5, 12, NULL, NULL),
(31, 6, 10, NULL, NULL),
(32, 6, 12, NULL, NULL),
(33, 2, 11, NULL, NULL),
(34, 2, 12, NULL, NULL),
(35, 7, 10, NULL, NULL),
(36, 7, 11, NULL, NULL),
(37, 7, 12, NULL, NULL),
(38, 4, 1, NULL, NULL),
(39, 4, 2, NULL, NULL),
(40, 4, 3, NULL, NULL),
(41, 1, 13, NULL, NULL),
(42, 1, 14, NULL, NULL),
(43, 1, 15, NULL, NULL),
(44, 4, 13, NULL, NULL),
(45, 4, 14, NULL, NULL),
(46, 4, 15, NULL, NULL),
(47, 4, 4, NULL, NULL),
(48, 4, 5, NULL, NULL),
(49, 4, 6, NULL, NULL),
(50, 4, 7, NULL, NULL),
(51, 4, 8, NULL, NULL),
(52, 4, 9, NULL, NULL),
(53, 4, 16, NULL, NULL),
(54, 5, 16, NULL, NULL),
(55, 1, 16, NULL, NULL),
(56, 8, 11, NULL, NULL),
(57, 8, 12, NULL, NULL),
(58, 8, 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfis`
--

CREATE TABLE `perfis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sistema` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `perfis`
--

INSERT INTO `perfis` (`id`, `nome`, `sistema`, `created_at`, `updated_at`) VALUES
(1, 'Suporte', 'dev', NULL, NULL),
(2, 'Admin', 'admin', NULL, NULL),
(3, 'Gestora', 'gestora', NULL, NULL),
(4, 'Diretoria', 'diretoria', NULL, NULL),
(5, 'Coordenadora', 'coordenadora', NULL, NULL),
(6, 'Colaboradora', 'colaboradora', NULL, NULL),
(7, 'Subcoordenadora', 'subcoordenadora', NULL, NULL),
(8, 'Recepção', 'secretaria', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `permissoes`
--

CREATE TABLE `permissoes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sistema` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `permissoes`
--

INSERT INTO `permissoes` (`id`, `nome`, `sistema`, `created_at`, `updated_at`) VALUES
(1, 'Listagem de usuários', 'users.list', NULL, NULL),
(2, 'Criação de usuários', 'users.create', NULL, NULL),
(3, 'Edição de usuários', 'users.update', NULL, NULL),
(4, 'Listagem de filiais', 'filiais.list', NULL, NULL),
(5, 'Criação de filiais', 'filiais.create', NULL, NULL),
(6, 'Edição de filiais', 'filiais.update', NULL, NULL),
(7, 'Listagem de setores', 'setores.list', NULL, NULL),
(8, 'Criação de setores', 'setores.create', NULL, NULL),
(9, 'Edição de setores', 'setores.update', NULL, NULL),
(10, 'Listagem de tarefas', 'tarefas.list', NULL, NULL),
(11, 'Criação de tarefas', 'tarefas.create', NULL, NULL),
(12, 'Edição de tarefas', 'tarefas.update', NULL, NULL),
(13, 'Listagem de atividades', 'atividades.list', NULL, NULL),
(14, 'Criação de atividades', 'atividades.create', NULL, NULL),
(15, 'Edição de atividades', 'atividades', NULL, NULL),
(16, 'Relatórios', 'relatorios', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `relatorios`
--

CREATE TABLE `relatorios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `equipe` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_atividade` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filial` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `periodo` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relatorio` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarefa_ids` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarefas_novas_ids` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarefas_em_andamento_ids` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarefa_concluidas_ids` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `setores`
--

CREATE TABLE `setores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tarefas`
--

CREATE TABLE `tarefas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao_execucao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_dt` datetime NOT NULL,
  `entrega_dt` datetime DEFAULT NULL,
  `limite_dt` datetime NOT NULL,
  `encerramento_dt` datetime DEFAULT NULL,
  `solicitacao_user_id` bigint(20) UNSIGNED NOT NULL,
  `filial_id` bigint(20) UNSIGNED NOT NULL,
  `responsavel_user_id` bigint(20) UNSIGNED NOT NULL,
  `tarefa_status_id` bigint(20) UNSIGNED NOT NULL,
  `tarefa_origem_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `processo_numero` char(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `atividade_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tarefa_status`
--

CREATE TABLE `tarefa_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sistema` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `tarefa_status`
--

INSERT INTO `tarefa_status` (`id`, `nome`, `sistema`, `created_at`, `updated_at`) VALUES
(1, 'Aguardando', 'aguardando', NULL, NULL),
(2, 'Em andamento', 'andamento', NULL, NULL),
(4, 'Concluído', 'encerrada', NULL, NULL),
(7, 'Aguardando revisão', 'aguardando_revisao', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perfil_id` bigint(20) UNSIGNED NOT NULL,
  `filial_id` bigint(20) UNSIGNED DEFAULT NULL,
  `setor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `colaboradora_id` int(1) DEFAULT NULL,
  `coordenadora_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `atividade_tipos`
--
ALTER TABLE `atividade_tipos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `execucoes`
--
ALTER TABLE `execucoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `execucoes_status_id_foreign` (`status_id`),
  ADD KEY `execucoes_executante_id_foreign` (`executante_id`),
  ADD KEY `execucoes_tarefa_id_foreign` (`tarefa_id`);

--
-- Índices para tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Índices para tabela `filiais`
--
ALTER TABLE `filiais`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Índices para tabela `perfil_permissao`
--
ALTER TABLE `perfil_permissao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `perfil_permissao_perfil_id_foreign` (`perfil_id`),
  ADD KEY `perfil_permissao_permissao_id_foreign` (`permissao_id`);

--
-- Índices para tabela `perfis`
--
ALTER TABLE `perfis`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `permissoes`
--
ALTER TABLE `permissoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Índices para tabela `relatorios`
--
ALTER TABLE `relatorios`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `setores`
--
ALTER TABLE `setores`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `tarefas`
--
ALTER TABLE `tarefas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tarefas_solicitacao_user_id_foreign` (`solicitacao_user_id`),
  ADD KEY `tarefas_filial_id_foreign` (`filial_id`),
  ADD KEY `tarefas_responsavel_user_id_foreign` (`responsavel_user_id`),
  ADD KEY `tarefas_tarefa_status_id_foreign` (`tarefa_status_id`),
  ADD KEY `tarefas_tarefa_origem_id_foreign` (`tarefa_origem_id`);

--
-- Índices para tabela `tarefa_status`
--
ALTER TABLE `tarefa_status`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_perfil_id_foreign` (`perfil_id`),
  ADD KEY `users_filial_id_foreign` (`filial_id`),
  ADD KEY `users_setor_id_foreign` (`setor_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `atividade_tipos`
--
ALTER TABLE `atividade_tipos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `execucoes`
--
ALTER TABLE `execucoes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `filiais`
--
ALTER TABLE `filiais`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `perfil_permissao`
--
ALTER TABLE `perfil_permissao`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de tabela `perfis`
--
ALTER TABLE `perfis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `permissoes`
--
ALTER TABLE `permissoes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `relatorios`
--
ALTER TABLE `relatorios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `setores`
--
ALTER TABLE `setores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tarefas`
--
ALTER TABLE `tarefas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tarefa_status`
--
ALTER TABLE `tarefa_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;


-- password is xuxu

insert into users (name, email, password, perfil_id) values ('admin', 'admin@admin.com', '$2y$10$8kVX.vherlwh9QdrCacNH.jRnvDqvXrJ0/FfEgjP084hBZLLia.Y.')


