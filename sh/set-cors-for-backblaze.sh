

# obtain api url like:
# curl -i \
# -H 'Accept:application/json' \
# -u '00553b9bc40c0840000000001:K005XpokuObU/1o1HubdnEwVJzsoLL4' \
# https://api.backblazeb2.com/b2api/v4/b2_authorize_account

b2 bucket update --cors-rules "$(<./backblaze-cors-policy.json)" rizz-gpt