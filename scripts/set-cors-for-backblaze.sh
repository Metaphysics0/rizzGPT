

# obtain api url like:
# curl -i \
# -H 'Accept:application/json' \
# -u 'BACKBLAZE_APPLICATION_ID:BACKBLAZE_APPLICATION_KEY' \
# https://api.backblazeb2.com/b2api/v4/b2_authorize_account

b2 bucket update --cors-rules "$(<./backblaze-cors-policy.json)" rizz-gpt