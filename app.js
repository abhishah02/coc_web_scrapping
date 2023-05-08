const request = require("request");
const cheerio = require("cheerio");

// request("https://cocbases.com/best-th15-base-link/", cb);
// function cb(error, html) {
//   if (error) {
//     console.error("error: ", error);
//   } else {
//     console.log(html);
//     handleHtml(html);
//   }
// }

// function handleHtml(html) {
//   let setTool = cheerio.load(html);
//   let imgURLArry = setTool(".awr").text();
//   //   console.log(imgURLArry);
//   //   console.log(setTool);
// }

const getHTML = async (url) => {
  return new Promise((resolve, _reject) => {
    request(url, (error, _response, htmlDetail) => {
      if (error) {
        resolve();
      }
      resolve(htmlDetail);
    });
  });
};

// const th15AllBase = async () => {
//   let html = await getHTML(`https://cocbases.com/best-th15-base-link/`);
//   let setTool = cheerio.load(html);

//   let tot = setTool(".awr .wp-caption");
//   let pTagArry = setTool(".wp-caption.alignnone");
//   let imgURLArry = setTool(".wp-caption.alignnone");

//   console.log(tot.length);
//   console.log(pTagArry.length);
//   console.log(imgURLArry.length);
//   for (let x = 0; x < imgURLArry.length; x++) {
//     const imgUrl = setTool(imgURLArry[x]).find("a").attr("href");
//     // console.log("Img-Url :", imgUrl);
//   }
//   for (let i = 0; i < pTagArry.length; i++) {
//     const pTag = setTool(pTagArry[i]).find("p").text();

//     // console.log("P-Tag :", pTag);
//   }
//   console.log(setTool);
//   console.log(html);
// };

const allBaseTargetURL = async () => {
  let html = await getHTML(`https://cocbases.com/`);
  let $ = cheerio.load(html);

  // console.log($);
  let aTagURL = $(".awr .btn.blue.left.small");
  // console.log(aTagURL.length);

  const allBaseData = [];
  for (let i = 0; i < aTagURL.length; i++) {
    const url = $(aTagURL[i]).attr("href");
    const thName = $(aTagURL[i]).text();
    // console.log(url);
    // console.log(thName);

    const baseData = [];
    const basehtml = await getHTML(`${url}`);
    let $$ = cheerio.load(basehtml);
    // let totData = $$(".awr .wp-caption");
    let pageNoArr = $$(".post-page-numbers");
    // console.log(totData);
    // console.log(pageNoArr);
    for (let page = 0; page < pageNoArr.length; page++) {
      const pageLoad = $$(pageNoArr[page]).text();
      if (pageLoad !== "" && pageLoad !== "Next") {
        // console.log("page:",pageLoad);

        for (let z = 1; z <= pageLoad; z++) {
          const pageHTML = await getHTML(`${url}` + z);
          let $$$ = cheerio.load(pageHTML);
          let totData = $$$(".awr .wp-caption");

          // console.log(totData.length);
          for (let x = 0; x < totData.length; x++) {
            const imgUrl = $$(totData[x]).find("a").attr("href");
            const pTag = $$(totData[i]).find("p").text();

            baseData.push({
              imgUrl,
              pTag,
            });
          }
        }
      }
    }

    // console.log(baseData);

    // var parseBaseData = JSON.stringify(baseData);

    allBaseData.push({
      url,
      thName,
      baseData,
    });
  }
  console.log(allBaseData);
};

allBaseTargetURL();
