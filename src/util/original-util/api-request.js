class ApiRequest {

    async Get(url){
      try {
        // fetchでGETリクエストを送信し、レスポンスを取得
        const response = await fetch(url);


        // HTTPステータスがOKの場合
        if (response.ok) {
            return await response.json();
        }
        else {
          // HTTPステータスがOKでない場合はエラーを表示
            log.log('Error:', response.status);
            return 0;
        }
      } catch (error) {
        // エラーが発生し,た場合はエラーメッセージを表示
        log.log('Error:', error);
        return 0;
      }
    }
}
module.exports = ApiRequest;
