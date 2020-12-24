node('PlatformSoftware') {
  stage('Checkout') {
    checkoutRepo('cbdr', 'oneiam-js')
  }
  stage('Install') {
    sh '''#!/bin/bash -el
      if [ ! -x "$HOME/bin/docker-compose" ]; then
        mkdir -p "$HOME/bin"
        curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o "$HOME/bin/docker-compose"
        chmod +x "$HOME/bin/docker-compose"
      fi
    '''
  }
  stage('Test') {
    withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DHUSERNAME', passwordVariable: 'DHPASSWORD')]) {
      sh '''#!/bin/bash -el
        docker login --username "$DHUSERNAME" --password "$DHPASSWORD"
        trap 'docker-compose down' EXIT
        docker-compose up --build --no-color --exit-code-from test test
      '''
    }
  }
}
