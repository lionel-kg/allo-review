pipeline {
    agent none
    tools {
        nodejs 'npm'
    }
    stages {    
        stage('update from git') {
            agent any
            steps{
                script{
                    sh '''
                cd /var/www/allo-review
                pwd
                git pull
                npm install
                npm run prod

            '''
                }
            }
        }
        stage('build containers') {
            agent any
            steps{
                script{
                sh '''
                    cd /var/www/allo-review/bdd-api-service
                    docker build -t bddreview .
                    cd /var/www/allo-review/front
                    docker build -t frontreview .
                    cd /var/www/allo-review/ia-service
                    docker build -t iareview .
                    cd /var/www/allo-review/notification-sms-service
                    docker build -t notifreview .
                    cd /var/www/allo-review/o-auth-service
                    docker build -t oauthreview .
                    cd /var/www/allo-review/payment-handler-service
                    docker build -t paymentreview .
                '''
                }
            }
        }
        stage('run containers') {
            agent any
            steps {
                script {
                    sh '''
                        docker run --name bddreview -d -p 7000:7000 -e PORT=7000 bddreview
                        docker run --name frontreview -d -p 3000:3000 -e PORT=3000 frontreview
                        docker run --name iareview -d -p 8000:8000 -e PORT=8000 iareview
                        docker run --name notifreview -d -p 5000:5000 -e PORT=5000 notifreview
                        docker run --name oauthreview -d -p 4000:4000 -e PORT=4000 oauthreview
                        docker run --name paymentreview -d -p ${PORT_EXPOSED}:5000 -e PORT=5000 paymentreview
                    '''
                }
            }
        }
    //      stage('Clean Container') {
    //       agent any
    //       steps {
    //          script {
    //            sh '''
    //              docker stop bddreview
    //              docker stop frontreview
    //              docker stop iareview
    //              docker stop notifreview
    //              docker stop oauthreview
    //              docker stop paymentreview

    //              docker rm bddreview
    //              docker rm frontreview
    //              docker rm iareview
    //              docker rm notifreview
    //              docker rm oauthreview
    //              docker rm paymentreview
    //            '''
    //          }
    //       }
    //  }
    stage('deploy it') {
    agent any
    steps {
        script {
            sh '''
                cd /var/www/porfolio-ynov
                pwd
                git pull
                npm install
                npm run prod

            '''
        }
    }
}
  }
     post {
        always {
            emailext (
                attachLog: true,
                from: 'lionelkomguemalma@gmail.com',
                to: 'lionel77350@gmail.com',
                subject: "Rapport de build - ${currentBuild.fullDisplayName}",
                body: "Bonjour,\n\nLe build ${currentBuild.fullDisplayName} s'est terminé avec le statut ${currentBuild.currentResult}.\n\nCordialement,\nJenkins",
            )
        }
    }
}