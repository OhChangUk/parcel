import { useEffect, useState } from 'react';

interface Company {
  International : string;
  Code : string;
  Name : string
}
interface ThemeColor {
  [key: string] : {
    back : string;
    hover : string;
    active : string;
    text : string;
    outline : string
  }
}
interface ButtonType {
  name : string;
  theme : string;
}

function App() {

  const [carriers, setCarriers] = useState<Company[]>([]);
  // 필터 되어서 보여짐
  const [allCarriers, setAllCarriers] = useState<Company[]>([]);
  const [theme, setTheme] = useState<string>('default');

  const [tcode, setTcode] = useState<string>('04');
  // 택배 코드
  const [tinvoice, setTinvoice] = useState<string>('');
  // 실제 운송장 번호
  const [tname, setTname] = useState<string>('CJ대한통운');
  // 택배사 이름
  const [isBtn, setIsBtn] = useState<number | null>(null);

  const themeColor :ThemeColor = {
    "default" : {
      "back" : "bg-indigo-500",
      "hover" : "hover:bg-indigo-300",
      "active" : "bg-indigo-400",
      "text" : "text-indigo-500",
      "outline" : "outline-indigo-300"
    },
    "orange" : {
      "back" : "bg-orange-500",
      "hover" : "hover:bg-orange-300",
      "active" : "bg-orange-400",
      "text" : "text-orange-500",
      "outline" : "outline-orange-300"
    },
    "yellow" : {
      "back" : "bg-yellow-500",
      "hover" : "hover:bg-yellow-300",
      "active" : "bg-yellow-400",
      "text" : "text-yellow-500",
      "outline" : "outline-yellow-300"
    }
  }

  const buttons :ButtonType[] = [
    {name: "기본", theme : "default"},
    {name: "오렌지", theme : "orange"},
    {name: "옐로우", theme : "yellow"}
  ]

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)

        const data = await res.json();
        console.log(data)

        setCarriers(data.Company);
        setAllCarriers(data.Company);

      }catch(error){
        console.log(error);
      }
    }
    fetchData();
  }, [])

  const selectCode = (BtnNumber :number, code :string, name : string) =>{
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : 'false'
    const filterCarriers = allCarriers.filter(e => e.International === isInternational);
    setCarriers(filterCarriers)
  }

  return (
    <>
      <div className={`${themeColor[theme].back} p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between`}>
        <h3 className="font-extrabold">국내.외 택배조회 시스템</h3>
        <div className="">
          <span className="">테마 :</span>
          {
            buttons.map((e,i)=>{
              return(
                <button key={i} className='mx-1 md:mx-2 xl:mx-3' onClick={()=>setTheme(e.theme)}>{e.name}</button>
              )
            })
          }
        </div>
      </div>
      <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center pt-2 flex-wrap">
        <div className="border-b basis-full p-2 flex justify-center items-center text-sm">
          <span className="basis-[30%] text-center mr-5">국내 / 국외 선택</span>
          <button onClick={()=> selectCode(1, '04', 'CJ대한통운')} className={`py-1 px-5 border border-[#ddd] rounded text-sm hover:text-white mr-4 ${isBtn === 1 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 1 ? themeColor[theme].active : ''}`}>국내</button>
          <button onClick={()=> selectCode(2, '12', 'EMS')} className={`py-1 px-5  border border-[#ddd] rounded text-sm hover:text-white ${isBtn === 2 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 2 ? themeColor[theme].active : ''}`}>국외</button>
        </div>
        {tcode}{tname}
        <select value={tcode} onChange={(e)=>{setTcode(e.target.value)}}>
          {
            carriers.map((e,i)=>{
              return(
                <option key={i} value={e.Code}>{e.Name}</option>
              )
            })
          }
        </select>
        <div className="basis-full py-4 border-b text-center">
          <input type="text" className='w-[80%] border px-5 py-2 rounded-md outline-indigo-300' />
        </div>
      </div>
    </>
  );
}

export default App;
