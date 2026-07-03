import{t as e}from"./arrow-up-down-C60GdO0M.js";import{t}from"./check-CZikrs93.js";import{t as n}from"./copy-EqiCX3Tg.js";import{t as r}from"./lock-CtI7SaJ3.js";import{B as i,Bt as a,D as o,En as s,Ht as c,L as l,On as u,R as d,Rt as f,S as p,Tn as m,Yt as h,an as g,jn as _,lt as v,st as y,u as b,v as x,x as S,z as C,zt as w}from"./index-0Laxzrrz.js";import{t as T}from"./RecentlyViewed-BSmCF0AL.js";var E=d(`flame`,[[`path`,{d:`M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,key:`1slcih`}]]),D=_(u(),1),O=y();function k(){let u=m(),d=v(),_=s(w),y=s(a);(0,D.useEffect)(()=>{y===`idle`&&u(f())},[y,u]),(0,D.useEffect)(()=>{document.title=`⚡ BeatBox Lightning Deals | Premium Audio & Gear`},[]);let[k,A]=(0,D.useState)(`all`),[j,M]=(0,D.useState)(`all`),[N,P]=(0,D.useState)(`discount_desc`),[F,I]=(0,D.useState)(null),[L,R]=(0,D.useState)(`live`),[z,B]=(0,D.useState)({hours:0,minutes:0,seconds:0});(0,D.useEffect)(()=>{let e=()=>{let e=new Date,t=new Date;t.setHours(24,0,0,0);let n=t-e;B({hours:Math.floor(n/(1e3*60*60)%24),minutes:Math.floor(n/1e3/60%60),seconds:Math.floor(n/1e3%60)})};e();let t=setInterval(e,1e3);return()=>clearInterval(t)},[]);let V=e=>{let t=(e*9301+49297)%233280/233280;return Math.floor(t*40)+50},H=(0,D.useMemo)(()=>{let e=_.filter(e=>e.discount>=45);if(k!==`all`){let t=k.toLowerCase();e=e.filter(e=>e.category&&e.category.toLowerCase().includes(t))}switch(j===`70+`?e=e.filter(e=>e.discount>=70):j===`60-69`?e=e.filter(e=>e.discount>=60&&e.discount<70):j===`under-1499`&&(e=e.filter(e=>e.price<1499)),N){case`price_asc`:e.sort((e,t)=>e.price-t.price);break;case`price_desc`:e.sort((e,t)=>t.price-e.price);break;case`rating_desc`:e.sort((e,t)=>t.rating-e.rating);break;default:e.sort((e,t)=>t.discount-e.discount);break}return e},[_,k,j,N]),U=(0,D.useMemo)(()=>_.filter(e=>e.discount>40&&e.discount<60).slice(5,9),[_]),W=(0,D.useMemo)(()=>_.length===0?null:[..._].sort((e,t)=>t.discount-e.discount)[0],[_]),G=(e,t)=>{t&&(t.preventDefault(),t.stopPropagation()),u(h({id:e.id,name:e.name,price:e.price,imageKey:e.imageKey,selectedColor:e.colors?.[0]?.name||`Default`,selectedColorCode:e.colors?.[0]?.code||`#111111`,category:e.category,imageUrl:e.imageUrl})),g.success(`⚡ claimed! ${e.name} added to cart!`,{style:{background:`#060b19`,color:`#fff`,border:`1px solid var(--bb-accent)`,borderRadius:`10px`}})},K=e=>{navigator.clipboard.writeText(e),I(e),g.success(`Coupon code "${e}" copied!`,{icon:`🎫`,style:{background:`#0a0d14`,color:`#fff`,border:`1px solid var(--bb-primary)`,borderRadius:`10px`}}),setTimeout(()=>I(null),2500)};return(0,O.jsxs)(`div`,{className:`w-100 min-vh-100 position-relative pb-5`,style:{backgroundColor:`var(--bb-bg-navy)`,overflowX:`hidden`},children:[(0,O.jsx)(`div`,{className:`bg-glow-orb`,style:{width:`500px`,height:`500px`,background:`var(--bb-primary-glow)`,top:`5%`,left:`-15%`,filter:`blur(130px)`,pointerEvents:`none`}}),(0,O.jsx)(`div`,{className:`bg-glow-orb`,style:{width:`600px`,height:`600px`,background:`var(--bb-accent-glow)`,top:`40%`,right:`-15%`,filter:`blur(150px)`,pointerEvents:`none`}}),(0,O.jsx)(`div`,{className:`d-flex align-items-center justify-content-center text-center px-3`,style:{background:`linear-gradient(90deg, #ef4444, #f97316, #ef4444)`,backgroundSize:`200% 200%`,animation:`gradientBG 4s linear infinite`,height:`38px`,fontSize:`0.85rem`,fontWeight:`800`,color:`#ffffff`,letterSpacing:`1px`,textTransform:`uppercase`,zIndex:100},children:(0,O.jsx)(`span`,{className:`d-flex align-items-center gap-2`,children:`🔥 Lightning Loot: Extra 10% Off with Code "DEAL10" at checkout! 🔥`})}),(0,O.jsxs)(`div`,{className:`container-fluid px-3 px-lg-5 pt-4`,children:[(0,O.jsx)(`div`,{className:`text-center mb-5 mt-3`,children:(0,O.jsxs)(C.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6},children:[(0,O.jsxs)(`span`,{className:`badge px-4 py-2 mb-3 text-white fw-black d-inline-flex align-items-center gap-2`,style:{background:`linear-gradient(135deg, #ef4444, #ec4899)`,borderRadius:`50px`,fontSize:`0.8rem`,letterSpacing:`1px`,boxShadow:`0 4px 15px rgba(239, 68, 68, 0.4)`},children:[(0,O.jsx)(`span`,{className:`live-pulse`}),` LIVE LIGHTNING DEALS`]}),(0,O.jsxs)(`h1`,{className:`display-4 fw-black text-theme-title mb-2`,style:{letterSpacing:`-2.5px`},children:[`BeatBox `,(0,O.jsx)(`span`,{className:`gradient-text-red`,children:`Loot Store`})]}),(0,O.jsx)(`p`,{className:`text-theme-muted mx-auto`,style:{maxWidth:`600px`,fontSize:`0.95rem`},children:`Exclusive, limited-quantity price drops. Grab your premium audio gears at their lowest prices ever. Resetting every day at midnight!`})]})}),W&&(0,O.jsx)(`section`,{className:`mb-5`,children:(0,O.jsxs)(C.div,{initial:{opacity:0,scale:.98},animate:{opacity:1,scale:1},transition:{duration:.6,delay:.1},className:`position-relative overflow-hidden p-4 p-md-5 rounded-4 glass-card border border-danger border-opacity-20`,style:{boxShadow:`0 20px 45px rgba(239, 68, 68, 0.12)`,background:`linear-gradient(135deg, rgba(20, 10, 15, 0.95), rgba(10, 15, 25, 0.95))`},children:[(0,O.jsx)(`div`,{className:`position-absolute rounded-circle bg-glow-orb`,style:{width:`300px`,height:`300px`,background:`rgba(239, 68, 68, 0.15)`,top:`10%`,right:`10%`,filter:`blur(100px)`,zIndex:1}}),(0,O.jsxs)(`div`,{className:`row align-items-center g-5 position-relative`,style:{zIndex:2},children:[(0,O.jsxs)(`div`,{className:`col-12 col-md-5 d-flex justify-content-center align-items-center position-relative`,children:[(0,O.jsxs)(`div`,{className:`hero-deal-badge`,children:[(0,O.jsx)(E,{size:16,fill:`currentColor`}),` `,W.discount,`% OFF`]}),(0,O.jsx)(`img`,{src:c[W.imageKey]||W.image,alt:W.name,className:`img-fluid hero-float`,style:{maxHeight:`340px`,objectFit:`contain`,filter:`drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 25px rgba(239, 68, 68, 0.25))`},onError:e=>{e.target.src=c.heroHeadphones}}),(0,O.jsx)(`div`,{className:`position-absolute rounded-circle border border-danger border-opacity-10`,style:{width:`380px`,height:`380px`,zIndex:-1,animation:`spin 40s linear infinite`}})]}),(0,O.jsxs)(`div`,{className:`col-12 col-md-7 text-start`,children:[(0,O.jsxs)(`div`,{className:`d-flex align-items-center gap-2 mb-3`,children:[(0,O.jsx)(`span`,{className:`badge text-white px-3 py-2 fw-black text-uppercase`,style:{background:`linear-gradient(135deg, #ef4444, #f97316)`,fontSize:`0.75rem`,borderRadius:`50px`,letterSpacing:`1px`},children:`⚡ DEAL OF THE DAY`}),(0,O.jsxs)(`span`,{className:`text-theme-muted small fw-bold d-flex align-items-center gap-1`,children:[(0,O.jsx)(x,{size:14,className:`text-warning fill-warning`}),` `,W.rating,` | `,W.reviewCount,` Reviews`]})]}),(0,O.jsx)(`h2`,{className:`fw-black text-theme-title display-6 mb-2`,style:{letterSpacing:`-1.5px`},children:W.name}),(0,O.jsx)(`h5`,{className:`text-danger fw-extrabold mb-4`,children:W.usp}),(0,O.jsx)(`p`,{className:`text-theme-muted small mb-4`,style:{lineHeight:1.6,maxWidth:`580px`},children:W.description||`Elevate your gaming and acoustic experience with our industry-leading audio response technology. Designed with soft protein ear cushions, deep sub-woofers, and ultra-high-definition audio components.`}),(0,O.jsxs)(`div`,{className:`mb-4`,children:[(0,O.jsx)(`span`,{className:`small text-theme-muted d-block mb-2 fw-bold uppercase-label`,children:`LIGHTNING DEAL ENDS IN:`}),(0,O.jsxs)(`div`,{className:`d-flex align-items-center gap-2`,children:[(0,O.jsxs)(`div`,{className:`timer-box`,children:[(0,O.jsx)(`span`,{className:`d-block timer-number`,children:String(z.hours).padStart(2,`0`)}),(0,O.jsx)(`span`,{className:`timer-label`,children:`Hours`})]}),(0,O.jsx)(`span`,{className:`timer-colon`,children:`:`}),(0,O.jsxs)(`div`,{className:`timer-box`,children:[(0,O.jsx)(`span`,{className:`d-block timer-number`,children:String(z.minutes).padStart(2,`0`)}),(0,O.jsx)(`span`,{className:`timer-label`,children:`Mins`})]}),(0,O.jsx)(`span`,{className:`timer-colon`,children:`:`}),(0,O.jsxs)(`div`,{className:`timer-box`,children:[(0,O.jsx)(`span`,{className:`d-block timer-number`,children:String(z.seconds).padStart(2,`0`)}),(0,O.jsx)(`span`,{className:`timer-label`,children:`Secs`})]})]})]}),(0,O.jsxs)(`div`,{className:`mb-4`,style:{maxWidth:`380px`},children:[(0,O.jsxs)(`div`,{className:`d-flex justify-content-between mb-1 small fw-bold`,children:[(0,O.jsxs)(`span`,{className:`text-danger`,children:[`🔥 `,V(W.id),`% Claimed`]}),(0,O.jsx)(`span`,{className:`text-theme-muted`,children:`Only a few left in stock!`})]}),(0,O.jsx)(`div`,{className:`progress`,style:{height:`8px`,background:`rgba(255,255,255,0.06)`,borderRadius:`50px`,overflow:`hidden`},children:(0,O.jsx)(`div`,{className:`progress-bar progress-bar-striped progress-bar-animated bg-danger`,role:`progressbar`,style:{width:`${V(W.id)}%`},"aria-valuenow":V(W.id),"aria-valuemin":`0`,"aria-valuemax":`100`})})]}),(0,O.jsxs)(`div`,{className:`d-flex flex-wrap align-items-center gap-4 pt-2`,children:[(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{className:`d-flex align-items-baseline gap-2`,children:[(0,O.jsxs)(`span`,{className:`fs-2 fw-black text-theme-title`,children:[`₹`,W.price.toLocaleString(`en-IN`)]}),(0,O.jsxs)(`span`,{className:`text-decoration-line-through text-theme-muted fs-5`,children:[`₹`,W.oldPrice.toLocaleString(`en-IN`)]})]}),(0,O.jsxs)(`span`,{className:`text-success small fw-extrabold`,children:[`Save ₹`,(W.oldPrice-W.price).toLocaleString(`en-IN`),` (Free Delivery Included)`]})]}),(0,O.jsxs)(`button`,{onClick:()=>G(W),className:`btn btn-danger-glow py-3 px-5 fw-bold d-flex align-items-center gap-2 hover-scale`,style:{borderRadius:`12px`,height:`55px`},children:[(0,O.jsx)(S,{size:18}),` Claim Deal Now`]})]})]})]})]})}),(0,O.jsxs)(`section`,{className:`mb-5`,children:[(0,O.jsxs)(`div`,{className:`text-center mb-4`,children:[(0,O.jsx)(`h4`,{className:`fw-black text-theme-title mb-1`,children:`Exclusive Coupon Codes`}),(0,O.jsx)(`p`,{className:`text-theme-muted small`,children:`Click any coupon below to copy and apply at checkout for extra savings!`})]}),(0,O.jsx)(`div`,{className:`row g-3 row-cols-1 row-cols-md-3`,children:[{code:`DEAL10`,value:`EXTRA 10% OFF`,desc:`Valid on all Daily Deal products`,badge:`DEAL MAJESTIC`},{code:`BEATVIP`,value:`EXTRA 15% OFF`,desc:`Valid on orders above ₹3,000`,badge:`HIGH ROLLER`},{code:`FREESHIP`,value:`FREE EXPRESS SHIPPING`,desc:`No minimum order required today`,badge:`FAST & FREE`}].map((e,r)=>(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsxs)(`div`,{className:`coupon-card h-100 position-relative p-4 rounded-4`,onClick:()=>K(e.code),style:{background:`var(--bb-surface)`,border:`1px dashed rgba(255, 255, 255, 0.15)`,cursor:`pointer`,transition:`all 0.3s ease`},children:[(0,O.jsx)(`div`,{className:`coupon-notch-left`}),(0,O.jsx)(`div`,{className:`coupon-notch-right`}),(0,O.jsxs)(`div`,{className:`d-flex justify-content-between align-items-start mb-3`,children:[(0,O.jsx)(`span`,{className:`badge bg-secondary bg-opacity-25 text-theme-title small fw-bold px-2 py-1`,style:{fontSize:`0.65rem`},children:e.badge}),(0,O.jsx)(`div`,{className:`text-theme-muted`,children:F===e.code?(0,O.jsx)(t,{size:16,className:`text-success`}):(0,O.jsx)(n,{size:16})})]}),(0,O.jsx)(`h3`,{className:`fw-black text-theme-title gradient-text mb-1`,children:e.value}),(0,O.jsx)(`h6`,{className:`fw-black text-accent mb-2 uppercase-label tracking-wide`,children:e.code}),(0,O.jsx)(`p`,{className:`text-theme-muted small mb-0`,children:e.desc})]})},r))})]}),(0,O.jsxs)(`div`,{className:`d-flex justify-content-center gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3`,children:[(0,O.jsxs)(`button`,{className:`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all ${L===`live`?`active-deal-tab`:`inactive-deal-tab`}`,onClick:()=>R(`live`),children:[`⚡ Live Deals (`,H.length,`)`]}),(0,O.jsxs)(`button`,{className:`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all ${L===`upcoming`?`active-deal-tab-upcoming`:`inactive-deal-tab`}`,onClick:()=>R(`upcoming`),children:[`🔒 Upcoming Drops (`,U.length,`)`]})]}),(0,O.jsx)(i,{mode:`wait`,children:L===`live`?(0,O.jsxs)(C.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},exit:{opacity:0,y:-15},transition:{duration:.4},children:[(0,O.jsxs)(`div`,{className:`d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-5`,children:[(0,O.jsx)(`div`,{className:`d-flex align-items-center gap-2 overflow-x-auto py-2 no-scrollbar`,style:{WebkitOverflowScrolling:`touch`},children:[{id:`all`,label:`All Deals`},{id:`tws`,label:`TWS Earbuds`},{id:`headphones`,label:`Headphones`},{id:`neckbands`,label:`Neckbands`},{id:`smartwatches`,label:`Smart Watches`},{id:`speakers`,label:`Speakers & Soundbars`}].map(e=>{let t=k===e.id;return(0,O.jsx)(`button`,{onClick:()=>A(e.id),className:`btn px-4 py-2 border-0 rounded-pill fw-bold text-nowrap transition-all hover-scale`,style:{fontSize:`0.8rem`,background:t?`linear-gradient(135deg, #ef4444, #f97316)`:`var(--bb-surface)`,color:t?`#ffffff`:`var(--bb-title-color)`,border:t?`none`:`1px solid var(--bb-border)`,boxShadow:t?`0 8px 20px rgba(239, 68, 68, 0.2)`:`none`},children:e.label},e.id)})}),(0,O.jsxs)(`div`,{className:`d-flex align-items-center gap-3`,children:[(0,O.jsxs)(`div`,{className:`position-relative`,children:[(0,O.jsxs)(`select`,{value:j,onChange:e=>M(e.target.value),className:`form-select fw-semibold`,style:{background:`var(--bb-surface)`,border:`1px solid var(--bb-border)`,color:`var(--bb-title-color)`,borderRadius:10,height:42,paddingLeft:16,paddingRight:36,fontSize:`0.85rem`,appearance:`none`,cursor:`pointer`,minWidth:160},children:[(0,O.jsx)(`option`,{value:`all`,children:`All Discounts`}),(0,O.jsx)(`option`,{value:`70+`,children:`70% Off & Above`}),(0,O.jsx)(`option`,{value:`60-69`,children:`60% - 69% Off`}),(0,O.jsx)(`option`,{value:`under-1499`,children:`Deals Under ₹1,499`})]}),(0,O.jsx)(l,{size:14,className:`position-absolute`,style:{right:14,top:`50%`,transform:`translateY(-50%)`,color:`var(--bb-muted)`,pointerEvents:`none`}})]}),(0,O.jsxs)(`div`,{className:`position-relative`,children:[(0,O.jsxs)(`select`,{value:N,onChange:e=>P(e.target.value),className:`form-select fw-semibold`,style:{background:`var(--bb-surface)`,border:`1px solid var(--bb-border)`,color:`var(--bb-title-color)`,borderRadius:10,height:42,paddingLeft:16,paddingRight:36,fontSize:`0.85rem`,appearance:`none`,cursor:`pointer`,minWidth:190},children:[(0,O.jsx)(`option`,{value:`discount_desc`,children:`Biggest Discount First`}),(0,O.jsx)(`option`,{value:`price_asc`,children:`Price: Low to High`}),(0,O.jsx)(`option`,{value:`price_desc`,children:`Price: High to Low`}),(0,O.jsx)(`option`,{value:`rating_desc`,children:`Highest Rated First`})]}),(0,O.jsx)(e,{size:14,className:`position-absolute`,style:{right:14,top:`50%`,transform:`translateY(-50%)`,color:`var(--bb-muted)`,pointerEvents:`none`}})]})]})]}),y===`loading`?(0,O.jsx)(`div`,{className:`row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4`,children:[1,2,3,4].map(e=>(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsx)(`div`,{className:`rounded-4 overflow-hidden`,style:{background:`var(--bb-surface)`,border:`1px solid var(--bb-border)`,height:380},children:(0,O.jsx)(`div`,{className:`skeleton-pulse w-100 h-100`})})},e))}):H.length===0?(0,O.jsxs)(`div`,{className:`text-center py-5 glass-card p-5`,style:{borderRadius:`16px`,border:`1px solid var(--bb-border)`},children:[(0,O.jsx)(`div`,{className:`mb-3`,style:{fontSize:`3rem`},children:`⚡`}),(0,O.jsx)(`h4`,{className:`text-theme-title fw-bold`,children:`No deals match your selection`}),(0,O.jsx)(`p`,{className:`text-theme-muted small`,children:`Try selecting another category or resetting filters.`}),(0,O.jsx)(`button`,{onClick:()=>{A(`all`),M(`all`)},className:`btn btn-glow mt-3 px-4 py-2 fw-bold`,style:{borderRadius:10},children:`Reset Filters`})]}):(0,O.jsx)(C.div,{layout:!0,className:`row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4`,children:(0,O.jsx)(i,{mode:`popLayout`,children:H.map((e,t)=>(0,O.jsx)(C.div,{layout:!0,initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.3},className:`col`,children:(0,O.jsxs)(`div`,{className:`card deal-product-card border-1 h-100 overflow-hidden text-start position-relative`,onClick:()=>d(`/products/${e.id}`),style:{cursor:`pointer`,background:`var(--bb-surface)`,borderRadius:`20px`,border:`1px solid var(--bb-border)`,transition:`all 0.3s ease`},children:[(0,O.jsx)(`div`,{className:`position-absolute top-0 start-0 m-3 z-3`,children:(0,O.jsxs)(`span`,{className:`badge text-white px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1`,style:{background:`linear-gradient(135deg, #ef4444, #f97316)`,fontSize:`0.65rem`},children:[(0,O.jsx)(b,{size:10,fill:`currentColor`}),` `,e.discount,`% OFF`]})}),(0,O.jsxs)(`div`,{className:`product-frame w-100 position-relative p-4 d-flex align-items-center justify-content-center`,style:{height:`220px`,background:`var(--bb-surface-2)`},children:[(0,O.jsx)(`img`,{src:c[e.imageKey]||e.image,alt:e.name,className:`product-img img-fluid`,style:{maxHeight:`100%`,objectFit:`contain`,transition:`all 0.3s`},onError:e=>{e.target.src=c.heroHeadphones}}),(0,O.jsx)(`div`,{className:`position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-pill`,style:{background:`rgba(0,0,0,0.6)`,backdropFilter:`blur(4px)`,border:`1px solid rgba(255,255,255,0.08)`},children:(0,O.jsx)(`span`,{style:{fontSize:`0.55rem`,fontWeight:`800`,color:`#fff`,letterSpacing:`0.5px`},children:`BEATBOX`})})]}),(0,O.jsxs)(`div`,{className:`d-flex align-items-center justify-content-between px-3 py-1.5 fw-bold`,style:{background:`linear-gradient(90deg, #ffc700, #ffb800)`,color:`#000000`,fontSize:`0.7rem`},children:[(0,O.jsx)(`span`,{className:`text-uppercase tracking-wider text-truncate`,style:{maxWidth:`70%`},children:e.usp||`BeatBox Signature Audio`}),(0,O.jsxs)(`span`,{className:`d-flex align-items-center gap-0.5 bg-white px-2 py-0.5 rounded-pill`,style:{fontSize:`0.65rem`,color:`#000`},children:[(0,O.jsx)(x,{size:10,fill:`#000`}),Number(e.rating||0).toFixed(1)]})]}),(0,O.jsxs)(`div`,{className:`card-body d-flex flex-column justify-content-between p-3`,children:[(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`h6`,{className:`fw-black text-theme-title mb-1 text-truncate hover-text-accent transition-all`,style:{fontSize:`0.95rem`},children:e.name}),(0,O.jsxs)(`div`,{className:`mb-3 mt-2`,children:[(0,O.jsxs)(`div`,{className:`d-flex justify-content-between mb-1`,style:{fontSize:`0.65rem`,fontWeight:700},children:[(0,O.jsxs)(`span`,{className:`text-danger`,children:[`🔥 `,V(e.id),`% Claimed`]}),(0,O.jsx)(`span`,{className:`text-theme-muted`,children:`Selling fast!`})]}),(0,O.jsx)(`div`,{className:`progress`,style:{height:`5px`,background:`rgba(255,255,255,0.05)`,borderRadius:`50px`},children:(0,O.jsx)(`div`,{className:`progress-bar bg-danger progress-bar-striped`,role:`progressbar`,style:{width:`${V(e.id)}%`}})})]})]}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`div`,{className:`d-flex justify-content-between align-items-baseline mb-3`,children:(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`span`,{className:`fw-black fs-5 text-theme-title`,children:[`₹`,e.price.toLocaleString(`en-IN`)]}),(0,O.jsxs)(`span`,{className:`text-decoration-line-through text-theme-muted small ms-2`,style:{fontSize:`0.75rem`},children:[`₹`,e.oldPrice.toLocaleString(`en-IN`)]})]})}),(0,O.jsxs)(`button`,{onClick:t=>{t.stopPropagation(),G(e)},className:`btn btn-add-to-cart w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold`,style:{fontSize:`0.85rem`},children:[(0,O.jsx)(S,{size:14}),` Claim Deal`]})]})]})]})},e.id))})})]},`live`):(0,O.jsx)(C.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},exit:{opacity:0,y:-15},transition:{duration:.4},className:`row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4`,children:U.map((e,t)=>(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsxs)(`div`,{className:`card h-100 position-relative`,style:{background:`var(--bb-surface)`,borderRadius:`20px`,border:`1px solid rgba(255,255,255,0.05)`,overflow:`hidden`,pointerEvents:`none`},children:[(0,O.jsx)(`div`,{className:`position-absolute top-0 start-0 m-3 z-3`,children:(0,O.jsxs)(`span`,{className:`badge bg-secondary text-white px-2 py-1 fw-bold text-uppercase d-flex align-items-center gap-1`,style:{fontSize:`0.65rem`},children:[(0,O.jsx)(r,{size:10}),` LOCKS IN 6H`]})}),(0,O.jsx)(`div`,{className:`w-100 position-relative p-4 d-flex align-items-center justify-content-center`,style:{height:`220px`,background:`var(--bb-surface-2)`,filter:`blur(6px) grayscale(0.8)`},children:(0,O.jsx)(`img`,{src:c[e.imageKey]||e.image,alt:``,className:`img-fluid`,style:{maxHeight:`100%`,objectFit:`contain`},onError:e=>{e.target.src=c.heroHeadphones}})}),(0,O.jsxs)(`div`,{className:`position-absolute d-flex flex-column align-items-center justify-content-center`,style:{top:`110px`,left:0,right:0,zIndex:10},children:[(0,O.jsx)(`div`,{className:`rounded-circle d-flex align-items-center justify-content-center`,style:{width:`48px`,height:`48px`,background:`rgba(0,0,0,0.85)`,border:`1px solid rgba(255,255,255,0.1)`},children:(0,O.jsx)(r,{size:20,className:`text-accent`})}),(0,O.jsx)(`span`,{className:`text-accent small fw-bold mt-2`,style:{textShadow:`0 0 10px rgba(0,243,255,0.5)`},children:`Unlocking at 4:00 PM`})]}),(0,O.jsxs)(`div`,{className:`card-body p-3 text-start`,style:{opacity:.4},children:[(0,O.jsx)(`h6`,{className:`fw-black text-theme-title mb-1 text-truncate`,children:e.name}),(0,O.jsxs)(`div`,{className:`d-flex align-items-baseline mb-3`,children:[(0,O.jsxs)(`span`,{className:`fw-black fs-5 text-theme-title`,children:[`₹`,e.price.toLocaleString(`en-IN`)]}),(0,O.jsxs)(`span`,{className:`text-decoration-line-through text-theme-muted small ms-2`,children:[`₹`,e.oldPrice.toLocaleString(`en-IN`)]})]}),(0,O.jsx)(`button`,{className:`btn btn-secondary w-100 py-2 fw-bold`,style:{fontSize:`0.85rem`},disabled:!0,children:`Unlocks Soon`})]})]})},e.id))},`upcoming`)}),(0,O.jsx)(`section`,{className:`py-5 mt-5 bg-theme-surface border-top border-bottom rounded-4`,style:{background:`var(--bb-surface)`},children:(0,O.jsxs)(`div`,{className:`row g-4 row-cols-1 row-cols-md-3 text-center`,children:[(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsxs)(`div`,{className:`d-flex flex-column align-items-center p-3`,children:[(0,O.jsx)(`div`,{className:`p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center`,style:{background:`rgba(239, 68, 68, 0.08)`,color:`#ef4444`},children:(0,O.jsx)(E,{size:24})}),(0,O.jsx)(`h6`,{className:`fw-bold text-theme-title mb-2`,children:`Price Drop Guaranteed`}),(0,O.jsx)(`p`,{className:`text-theme-muted small mb-0`,style:{maxWidth:`280px`},children:`These products are listed at their absolute lowest price point for the next 24 hours.`})]})}),(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsxs)(`div`,{className:`d-flex flex-column align-items-center p-3`,children:[(0,O.jsx)(`div`,{className:`p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center`,style:{background:`rgba(0, 243, 255, 0.08)`,color:`var(--bb-accent)`},children:(0,O.jsx)(p,{size:24})}),(0,O.jsx)(`h6`,{className:`fw-bold text-theme-title mb-2`,children:`100% Brand Authenticity`}),(0,O.jsx)(`p`,{className:`text-theme-muted small mb-0`,style:{maxWidth:`280px`},children:`All items are shipped directly from BeatBox warehouses, complete with 1-Year Brand Warranty.`})]})}),(0,O.jsx)(`div`,{className:`col`,children:(0,O.jsxs)(`div`,{className:`d-flex flex-column align-items-center p-3`,children:[(0,O.jsx)(`div`,{className:`p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center`,style:{background:`rgba(168, 32, 255, 0.08)`,color:`var(--bb-primary-light)`},children:(0,O.jsx)(o,{size:24})}),(0,O.jsx)(`h6`,{className:`fw-bold text-theme-title mb-2`,children:`Easy Claims & Replacements`}),(0,O.jsx)(`p`,{className:`text-theme-muted small mb-0`,style:{maxWidth:`280px`},children:`Not happy with your gear? Get a replacement processed in under 72 hours through our warranty portal.`})]})})]})}),(0,O.jsx)(`section`,{className:`py-5 px-0`,children:(0,O.jsx)(T,{})})]}),(0,O.jsx)(`style`,{children:`
        .live-pulse {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ef4444;
          box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .gradient-text-red {
          background: linear-gradient(135deg, #ef4444 30%, #ec4899 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-float {
          animation: floatHero 4s ease-in-out infinite;
        }
        @keyframes floatHero {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .hero-deal-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ef4444;
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.8rem;
          z-index: 10;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timer-box {
          min-width: 65px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }
        .timer-number {
          font-size: 1.4rem;
          font-weight: 900;
          color: #ef4444;
        }
        .timer-label {
          font-size: 0.65rem;
          color: var(--bb-muted);
          text-transform: uppercase;
        }
        .timer-colon {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ef4444;
        }
        .coupon-card {
          border-radius: 16px;
          overflow: hidden;
        }
        .coupon-card:hover {
          border-color: var(--bb-primary) !important;
          box-shadow: 0 10px 30px rgba(0, 243, 255, 0.08);
          transform: translateY(-3px);
        }
        .coupon-notch-left {
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bb-bg-navy);
          border-right: 1px dashed rgba(255, 255, 255, 0.15);
          z-index: 5;
        }
        .coupon-notch-right {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bb-bg-navy);
          border-left: 1px dashed rgba(255, 255, 255, 0.15);
          z-index: 5;
        }
        .active-deal-tab {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: #fff;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
        }
        .active-deal-tab-upcoming {
          background: linear-gradient(135deg, var(--bb-primary), var(--bb-accent));
          color: #fff;
          box-shadow: 0 6px 20px rgba(0, 243, 255, 0.25);
        }
        .inactive-deal-tab {
          background: rgba(255, 255, 255, 0.03);
          color: var(--bb-muted);
          border: 1px solid var(--bb-border) !important;
        }
        .inactive-deal-tab:hover {
          color: var(--bb-text);
          background: rgba(255, 255, 255, 0.08);
        }
        .deal-product-card:hover {
          border-color: rgba(239, 68, 68, 0.3) !important;
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.08);
          transform: translateY(-4px);
        }
        .deal-product-card:hover .product-img {
          transform: scale(1.05) translateY(-2px);
        }
        .btn-danger-glow {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          border: none;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
        }
        .btn-danger-glow:hover {
          box-shadow: 0 12px 35px rgba(239, 68, 68, 0.5);
          filter: brightness(1.1);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .uppercase-label {
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `})]})}export{k as default};