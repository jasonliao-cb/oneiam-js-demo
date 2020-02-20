node('PlatformSoftware') {
  stage('Checkout') {
    checkoutRepo('cbdr', 'oneiam-js')
  }
  stage('Install') {
    sh '''#!/bin/bash -l
      pip3 install docker-compose
    '''
  }
  stage('Test') {
    withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DHUSERNAME', passwordVariable: 'DHPASSWORD')]) {
      sh '''#!/bin/bash -l
        docker login --username "$DHUSERNAME" --password "$DHPASSWORD"
        trap 'docker-compose down' EXIT
        docker-compose up --build --no-color --exit-code-from test test
      '''
    }
  }
}
