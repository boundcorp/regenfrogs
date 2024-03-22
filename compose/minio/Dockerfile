# Self-service Minio container
# Automatically creates the $MINIO_BUCKET bucket and configures it for public downloads

FROM minio/mc AS mc
FROM minio/minio

RUN echo $'#!/usr/bin/env sh \n\
cat /bin/start-minio.sh \n\
AWAIT_STARTUP="sleep 5" \n\
CONFIGURE_ROOT="mc config host add local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD" \n\
DELETE_BUCKET="mc rm -r --force local/$MINIO_BUCKET || true" \n\
CREATE_BUCKET="mc mb local/$MINIO_BUCKET" \n\
ALLOW_DOWNLOADS="mc policy download local/$MINIO_BUCKET" \n\
sh -c "$AWAIT_STARTUP && $CONFIGURE_ROOT && $CREATE_BUCKET && $ALLOW_DOWNLOADS" & \n\
$*' > /bin/start-minio.sh

RUN chmod +x /bin/start-minio.sh
COPY --from=mc /usr/bin/mc /usr/bin/mc

ENTRYPOINT ["/bin/start-minio.sh"]
