import '../css/AuthForm.css'

const AuthForm = ({ type }) => {
  console.log(type)
  return (
    <div>
      <div>
        <h3 className='inputList'>
          {type === 'signup' ? '회원가입' : '로그인'}
        </h3>
      </div>
      <div className='inputList'>
        <input placeholder="이메일"></input>
        <input placeholder="비밀번호"></input>
        {type === 'signup' &&
          <input name='passwordCheck' type="password" placeholder='비밀번호 확인'></input>}
        <button>
          {type === 'signup' ? '가입하기' : '로그인'}
        </button>
      </div>
    </div >
  );
};

export default AuthForm;