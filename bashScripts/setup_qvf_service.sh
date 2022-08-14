#! /bin/sh

# QVF service name
QVF_SERVICE_NAME=qvf

QVF_SERVICE_FILE=/lib/systemd/system/${QVF_SERVICE_NAME}.service

TMP_QVF_SERVICE_FILE=$(mktemp -t ${QVF_SERVICE_NAME}.service.XXXXXXXXXX)

# Variables for systemd service file
DESCRIPTION="Quadratic Voting and Funding Service"

# Provide a URL, maybe
DOCUMENTATION=None

NODE_PORT=${QVF_NODE_PORT}
if [ -z "${NODE_PORT}" ] ; then
    # The default port for node
    NODE_PORT=3000
fi

NODE_EXE=$(which node)
QVF_SERVER_SCRIPT=/home/ubuntu/cardano-express-backend/server.js

cat <<EOF > ${TMP_QVF_SERVICE_FILE}
[Unit]
Description=${DESCRIPTION}
Documentation=${DOCUMENTATION}
After=network.target

[Service]
Environment=NODE_PORT=${NODE_PORT}
Type=simple
User=ubuntu
ExecStart=${NODE_EXE} ${QVF_SERVER_SCRIPT}
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

if [ ! -s ${TMP_QVF_SERVICE_FILE} ] ; then
    echo "Error: couldn't create qvf service file"
    exit 1
fi

sudo cp ${TMP_QVF_SERVICE_FILE} ${QVF_SERVICE_FILE}

rm -f  ${TMP_QVF_SERVICE_FILE}

if [ ! -s ${QVF_SERVICE_FILE} ] ; then
    echo "Error: couldn't create ${QVF_SERVICE_FILE}"
    exit 1
else
    echo "${QVF_SERVICE_FILE} created."
fi

# Notify systemd of a change
sudo systemctl -q daemon-reload

# Start the QVF service
sudo sudo systemctl -q start ${QVF_SERVICE_NAME}

# give it chance to start and then fail
sleep 3

if ! sudo systemctl -q is-active ${QVF_SERVICE_NAME}; then
    echo "Error: ${QVF_SERVICE_NAME} service is not running."
    exit 1
else
    echo "${QVF_SERVICE_NAME} service is running."
fi

exit 0




