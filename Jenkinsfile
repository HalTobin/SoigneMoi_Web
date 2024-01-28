pipeline {
    agent { label 'bbq2' }
     
    stages {
        stage('Build env') {
            steps {
                script {
                    SERVER = "$SERVER";
                    SONAR_SERVER = "$SONAR_SERVER";
                    NAME = 'SoigneMoi_Frontend';
                }
            }
        }

        stage('Project installation') {
            steps {
                sh """
                npm install -i
                """
            }
        }

        // stage('Unit test') {
        //     steps {
	    //         withEnv(['SERVER='+SERVER]){
	    //             sh """
	    //             npm run test -- --code-coverage --karma-config=karma.conf.js
        //             """
        //         }
        //     }
        // }

        // stage('Sonar Analysis') {
        // 	steps {
        // 		withCredentials([string(credentialsId: 'SonarqubeToken', variable: 'SONARLOGIN')]) {
        //         	withSonarQubeEnv('Sonarqube'){
        //                 withEnv(['TARGET='+TARGET]){
        //                     sh '''npx sonar-scanner \
        //                         -Dsonar.host.url=http://${SONAR_SERVER}:9000 \
        //                         -Dsonar.projectKey='''+NAME+''' \
        //                         -Dsonar.projectName='''+NAME+''' \
        //                         -Dsonar.login=${SONARLOGIN} \
        //                         -Dsonar.sources=src \
        //                         -Dsonar.exclusions=node_modules/*,**/*.spec.ts \
        //                         -Dsonar.javascript.lcov.reportPaths=coverage/terp-fe/lcov.info \
        //                         '''
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Compile') {
            steps {
                sh """
                npm run build
                """
            }
        }

        stage('Deploy') {
            steps {
                withEnv(['SERVER='+SERVER]){
                    sh '''
                    ssh -o StrictHostKeyChecking=no -p ${PORT} jenkins@${SERVER} 'rm -rf /opt/SoigneMoi/Frontend/*'
                    scp -o StrictHostKeyChecking=no -P ${PORT} -r ${WORKSPACE}/build/* jenkins@${SERVER}:/opt/SoigneMoi/Frontend/
                    '''
                }
            }
        }
    }

    post {
        cleanup {
            sh '''
            rm -rf ./*
            '''
        }
    }
}
