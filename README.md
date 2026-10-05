# Домашнее задание к занятию «Система мониторинга Zabbix» - `Фамилия Имя`

---

### Задание 1

Установка Zabbix Server с веб-интерфейсом (PostgreSQL + Apache) на Debian 11.

1. Установлен PostgreSQL из системного репозитория Debian 11.
2. С помощью конфигуратора на сайте [zabbix.com/download](https://www.zabbix.com/download) выбраны параметры: Zabbix 7.0 LTS, Debian 11 (Bullseye), Server + Frontend + Agent, PostgreSQL, Apache.
3. Добавлен репозиторий Zabbix, установлены пакеты сервера, веб-интерфейса и агента.
4. Создан пользователь и база данных `zabbix` в PostgreSQL, импортирована начальная схема.
5. В `/etc/zabbix/zabbix_server.conf` указан пароль к БД, сервисы запущены и добавлены в автозагрузку.
6. Выполнена первоначальная настройка через веб-интерфейс `http://<IP-сервера>/zabbix`, вход под `Admin` / `zabbix`.

```bash
# 1. Установка PostgreSQL
sudo apt update
sudo apt install -y postgresql

# 2. Установка репозитория Zabbix
wget https://repo.zabbix.com/zabbix/7.0/debian/pool/main/z/zabbix-release/zabbix-release_latest_7.0+debian11_all.deb
sudo dpkg -i zabbix-release_latest_7.0+debian11_all.deb
sudo apt update

# 3. Установка Zabbix Server, веб-интерфейса и агента
sudo apt install -y zabbix-server-pgsql zabbix-frontend-php php7.4-pgsql \
    zabbix-apache-conf zabbix-sql-scripts zabbix-agent

# 4. Создание пользователя и базы данных
sudo -u postgres createuser --pwprompt zabbix
sudo -u postgres createdb -O zabbix zabbix

# 5. Импорт начальной схемы и данных
zcat /usr/share/zabbix-sql-scripts/postgresql/server.sql.gz | sudo -u zabbix psql zabbix

# 6. Указание пароля к БД в конфиге сервера
sudo sed -i 's/# DBPassword=/DBPassword=<пароль>/' /etc/zabbix/zabbix_server.conf

# 7. Запуск сервисов и добавление в автозагрузку
sudo systemctl restart zabbix-server zabbix-agent apache2
sudo systemctl enable zabbix-server zabbix-agent apache2
```

Скриншот авторизации в админке:

![Авторизация в Zabbix](https://github.com/ProffeSOr24/solution-template/blob/main/img/zabbix-login.png)

---

### Задание 2

Установка Zabbix Agent на два хоста (хост 1 — сам Zabbix Server, хост 2 — отдельная ВМ).

1. На второй ВМ добавлен репозиторий Zabbix и установлен `zabbix-agent`.
2. В `/etc/zabbix/zabbix_agentd.conf` на обоих агентах указан IP Zabbix Server в параметрах `Server` и `ServerActive`.
3. Агенты перезапущены и добавлены в автозагрузку.
4. В веб-интерфейсе (Data collection / Configuration > Hosts > Create host) добавлены оба хоста с шаблоном `Linux by Zabbix agent` и интерфейсом Agent (IP хоста, порт 10050).
5. В Monitoring > Latest data проверено поступление данных.

```bash
# На второй ВМ: установка репозитория и агента
wget https://repo.zabbix.com/zabbix/7.0/debian/pool/main/z/zabbix-release/zabbix-release_latest_7.0+debian11_all.deb
sudo dpkg -i zabbix-release_latest_7.0+debian11_all.deb
sudo apt update
sudo apt install -y zabbix-agent

# На обоих агентах: разрешаем подключение с Zabbix Server
sudo sed -i 's/^Server=127.0.0.1/Server=<IP_Zabbix_Server>/' /etc/zabbix/zabbix_agentd.conf
sudo sed -i 's/^ServerActive=127.0.0.1/ServerActive=<IP_Zabbix_Server>/' /etc/zabbix/zabbix_agentd.conf

# Перезапуск и автозагрузка агента
sudo systemctl restart zabbix-agent
sudo systemctl enable zabbix-agent

# Проверка лога агента
sudo tail -f /var/log/zabbix/zabbix_agentd.log
```

Configuration > Hosts — агенты подключены к серверу:

![Hosts](https://github.com/ProffeSOr24/solution-template/blob/main/img/zabbix-hosts.png)

Лог Zabbix Agent:

![Agent log](https://github.com/ProffeSOr24/solution-template/blob/main/img/zabbix-agent-log.png)

Monitoring > Latest data для обоих хостов:

![Latest data](https://github.com/ProffeSOr24/solution-template/blob/main/img/zabbix-latest-data.png)

---

### Задание 3*

Установка Zabbix Agent на Windows.

1. С [zabbix.com/download_agents](https://www.zabbix.com/download_agents) скачан MSI-установщик Zabbix Agent (Windows, amd64, OpenSSL, версия 7.0).
2. При установке указаны: Host name — имя компьютера, Zabbix server IP/DNS и Server for active checks — IP Zabbix Server.
3. В брандмауэре Windows разрешён входящий TCP-порт 10050.
4. В веб-интерфейсе добавлен хост с шаблоном `Windows by Zabbix agent`.
5. В Monitoring > Latest data проверено свободное место на диске C:.

```powershell
# Тихая установка агента (PowerShell от администратора)
msiexec /l*v log.txt /i zabbix_agent-7.0-windows-amd64-openssl.msi /qn `
    SERVER=<IP_Zabbix_Server> SERVERACTIVE=<IP_Zabbix_Server> HOSTNAME=$env:COMPUTERNAME

# Разрешаем порт агента в брандмауэре
New-NetFirewallRule -DisplayName "Zabbix Agent" -Direction Inbound -Protocol TCP -LocalPort 10050 -Action Allow

# Проверка службы
Get-Service "Zabbix Agent"
```

Latest data — свободное место на диске C::

![Windows disk C](https://github.com/ProffeSOr24/solution-template/blob/main/img/zabbix-windows-disk-c.png)
