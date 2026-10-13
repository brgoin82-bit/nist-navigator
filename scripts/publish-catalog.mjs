import {spawnSync} from 'node:child_process';
if(process.env.GITHUB_REPOSITORY!=='brgoin82-bit/nist-navigator'||process.env.GITHUB_REF!=='refs/heads/main'||!process.env.GITHUB_TOKEN||!['schedule','workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME))throw new Error('Unexpected catalog publishing context');
function git(args,authorized=false){
  const env={...process.env};
  if(authorized){env.GIT_CONFIG_COUNT='1';env.GIT_CONFIG_KEY_0='http.https://github.com/.extraheader';env.GIT_CONFIG_VALUE_0='AUTHORIZATION: basic '+Buffer.from('x-access-token:'+process.env.GITHUB_TOKEN).toString('base64');}
  delete env.GITHUB_TOKEN;
  const result=spawnSync('git',args,{env,stdio:'pipe',encoding:'utf8',timeout:120000});
  if(result.status!==0)throw new Error('Catalog publication failed; inspect the GitHub workflow. No credentials are included in this error.');
  return result.stdout.trim();
}
git(['config','user.name','NIST catalog updater']);
git(['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
git(['add','--','dist/catalog.json','dist/update-status.json']);
if(git(['diff','--cached','--name-only'])){
  git(['commit','-m','Update verified NIST catalog and source-check timestamp']);
  git(['push','https://github.com/brgoin82-bit/nist-navigator.git','HEAD:main'],true);
  console.log('Verified public catalog published.');
}else console.log('No catalog changes to publish.');
