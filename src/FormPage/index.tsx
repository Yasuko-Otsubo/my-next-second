import { useState } from 'react';
import styles from './styles.module.css'


const FormPage: React.FC = () => {

  type ContactForm = {
    name: string;
    email: string;
    text: string;
  };

  //type Error = {
  //  name: string;
  //  email: string;
  //  text: string;    
  //}

  // Error型はContactFormのキーを使い、それぞれの値をstringにする 型再利用
  type Error = Record<keyof ContactForm, string>;

  //formのstateを初期化
  const [ form, setForm ] = useState<ContactForm>({ 
    name: '',
    email: '',
    text: ''
  });

  //errorのstateを初期化
  //エラー状態の初期値は空文字
  const [error, setError] = useState<Error>({
    name: '',
    email: '',
    text: ''
  }); 

  //フォームのクリア処理
  const clearForm = () => {
    setForm({ name: '', email: '', text: '' });
    setError({ name: '', email: '', text: '' });
  };
  
  //テキストエリアの変更時に入力値をstateに反映
  //handleFormでフォームの入力値が変更されたときに実行される
  //`input`要素の変更イベントを表す `e.target`が`HTMLInputElement`として扱われるため、`name`や`value`プロパティにアクセスできる
  const handleForm = (e: React.ChangeEvent<HTMLInputElement  | HTMLTextAreaElement>) => {
    setForm({
      //...formで既存の値を保持しつつ、指定された項目だけを更新
      ...form,
      //e.target.nameで変更が発生したフォームのname属性（例：name、email、text）を取得
      //e.target.valueで、その入力値を取得し、formの状態を更新
      [e.target.name]: e.target.value
  });
};
////////// ここまでconst FormPage //////////


  //送信ボタンクリックで入力値をログ出力
  const show = async() => {
    let isValid = true; // バリデーションが成功したかどうかを確認するフラグ

    //////////////////// name area ////////////////////
    const isValidNameLength = form.name.length >= 30;//名前入力が30字未満
    if (!form.name.trim()) {  //名前が空（またはスペースのみ）の場合
      setError(prev => ({ ...prev, name: "お名前は必須です" })); // エラーメッセージをセット
      isValid = false; // バリデーション失敗
    } 
    if (isValidNameLength) {
      setError(prev => ({ ...prev, name: "お名前は30字以内で入力してください" }));
      isValid = false;
    } 
    if (form.name.trim() && isValidNameLength) { // 名前が正しい場合、エラーメッセージをクリア
      setError(prev => ({ ...prev, name: "" }));
    }


    //////////////////// email area ////////////////////
    const isValidEmail = ( email : string ):boolean  => /\S+@\S+\.\S+/.test(email);//メールアドレスの形式
    if (!form.email.trim()) { 
      setError(prev => ({ ...prev, email: "メールアドレスは必須です" })); 
      isValid = false; // バリデーション失敗
    } 
    else if (form.email.trim() && !isValidEmail(form.email)) {
      setError(prev => ({ ...prev, email: "メールアドレスの形式が正しくありません" }));
      isValid = false;
    } 
    else if (form.email.trim() && isValidEmail(form.email)) {
      setError(prev => ({ ...prev, email: "" }));
    }


    //////////////////// text area ////////////////////
    const isValidTextLength = form.text.length >= 500 ;//名前入力が30字未満
    if (!form.text.trim()) {
      setError(prev => ({ ...prev, text: "本文は必須です" }));
      //return;
      isValid = false;
    } 
    if (isValidTextLength) {
      setError(prev => ({ ...prev, text: "本文は500字以内で入力してください" }));
      //return;
      isValid = false;
    } 
    if (form.text.trim() && isValidTextLength) {
      setError(prev => ({ ...prev, text: "" }));
    }



// バリデーションが成功した場合
    if (isValid) {
      try {
        //APIにリクエスト送信
        const response = await fetch (
          'https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts',
          {
            method: 'POST',
            //Content-Typeを設定し、サーバーに送信するデータがJSON形式であることを伝える
            //Content-Typeは、送信するデータの種類を示すヘッダーで、サーバーがどのようにデータを解釈すべきかを指定
            //application/jsonは、送信データがJSON形式であることを指定する標準的な値
            headers: { 'Content-Type': 'application/json' },
            //JSON.stringify(form) でJavaScriptオブジェクトである form をJSON文字列に変換
            body: JSON.stringify(form) // 入力データをJSON形式に変換
          }
        );

        if(response.ok) {
          alert("送信しました");
        clearForm(); // 送信後にフォームをクリア
        } else {
          console.error("APIエラー", response.statusText);
          alert("送信中にエラーが発生しました。");
        }
      } catch (error) {
        console.error("通信エラー", error);
        alert("送信中にエラーが発生しました。");
      }
    }
  };



  
  return (
    <div className={styles.form_page}>
      <h2 className={styles.f_title}>問い合わせフォーム</h2>
      <form className={styles.form_area}>

        <div className={styles.f_input}> 
        <div className={styles.f_input_upper}>
          <label htmlFor='name'>お名前</label>
          <input id="name" name='name' type="text"
          onChange={handleForm} value={form.name}
          className={styles.f_note}/>
          </div>
          {error.name && <p className={styles.f_note_error}>{error.name}</p>}

        </div>

        <div className={styles.f_input}>
          <div className={styles.f_input_upper}>
            <label htmlFor='email'>メールアドレス</label>
            <input id="email" name='email' type="text"
            onChange={handleForm} value={form.email} />
          </div>
          {error.email && <p className={styles.f_note_error}>{error.email}</p>}
        </div>

        <div className={styles.f_input}>
        <div className={styles.f_input_upper}>
          <label htmlFor="comment">本文</label><br />
          <textarea id="text" name="text"
          cols={30} rows={7}
          value={form.text}
          onChange={handleForm}></textarea><br />
          </div>
          {error.text && <p className={styles.f_note_error}>{error.text}</p>}
        </div>

        <div className={styles.f_btn}>
          <button type="button" className={styles.f_send} onClick={show}>送信</button>
          <button type="button" className={styles.f_clear} onClick={clearForm}>クリア</button>
          </div>
      </form>
    </div>
  );
}

export default FormPage;