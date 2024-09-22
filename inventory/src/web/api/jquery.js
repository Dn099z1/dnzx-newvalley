var isDragging = false;
var maxDropItens = 18
var currentZoom = 1;

$(document).ready(function(){
	window.addEventListener("message",function(event){
		switch(event["data"]["action"]){
			case "showMenu":
				updateMochila();
				$(".inventory").fadeIn(300)
			break;

			case "hideMenu":
				$(".inventory").fadeOut(0)
			break;

			case "updateMochila":
				updateMochila();
			break;

			case "showHotbar":
				$(".hotbar").css('display','flex');
			break

			case "hideHotbar":
				$(".hotbar").fadeOut(100);
			break;
		}
	});

	document.onkeyup = data => {
		if (data["key"] === "Escape"){
			$.post("http://inventory/invClose");
			$(".inventory-sctructureR").html("");
			$(".inventory-sctructureL").html("");
			$(".inventory-hotkeys").html("");
		}
	};
});

let clothesStatus = [
	{
		name: 'Hat',
		status: false,
		img: './assets/hat',
	},
	{
		name: 'Jacket',
		status: false,
		img: './assets/torso'
	},
	{
		name: 'Pants',
		status: false,
		img: './assets/pant',
	},
	{
		name: 'Arms',
		status: false,
		img: './assets/hands',
	},
	{
		name: 'Shoes',
		status: false,
		img: './assets/shoes',
	},
	{
		name: 'Watch',
		status: false,
		img: './assets/watch',
	},
	{
		name: 'Mask',
		status: false,
		img: './assets/mask',
	},
	{
		name: 'Acessory',
		status: false,
		img: './assets/acessory',
	},
	{
		name: 'Shirt',
		status: false,
		img: './assets/tshirt',
	},
	{
		name: 'Vest',
		status: false,
		img: './assets/vest',
	},
	{
		name: 'Glasses',
		status: false,
		img: './assets/eye',
	},
	{
		name: 'Ear',
		status: false,
		img: './assets/near',
	},
]

const updateClothes = () => {

	$(".firstClothe").html("");
	$(".secondClothe").html("");

	for(let i = 0; i < 6; i++){
		$(".firstClothe").append(`
			<li onclick="handleChangeClothe('${clothesStatus[i].name}')" class="${!clothesStatus[i].status ? 'active clotheli' : 'clotheli'}">
				<div class='slot'>
					<img src="${!clothesStatus[i].status ? clothesStatus[i].img+'green.png' : clothesStatus[i].img+'.png' }" alt=""/>
				</div>
			</li>
		`);
	}
	
	for(let i = 0; i < clothesStatus.length; i++){
		if (i > 5){
			$(".secondClothe").append(`
			<li onclick="handleChangeClothe('${clothesStatus[i].name}')" class="${!clothesStatus[i].status ? 'active clotheli' : 'clotheli'}">
				<div class='slot'>
				<img src="${!clothesStatus[i].status ? clothesStatus[i].img+'green.png' : clothesStatus[i].img+'.png' }" alt=""/>
				</div>
			</li>
		`);
		}
	}
}

updateClothes();



$(document).ready(function() {
	var amount = "3"; // Sempre usa o nível 2
	acessibilityZoom(amount);


	$(document).on("auxclick", ".populated", function(e) {
		if (e.which === 3) { // Verifica se o clique foi com o botão direito
			// O elemento clicado é obtido diretamente de e.target
			const item = $(e.target).closest('.populated');
			const shiftPressed = e.shiftKey;
	
			// Agora, 'item' representa o elemento '.populated' mais próximo do local do clique
			// Isso garante que você esteja sempre trabalhando com o elemento '.populated' correto,
			// independentemente de qual filho direto ou indireto foi clicado.
	
			let itemData = {
				key: item.data("item-key"),
				slot: item.data("slot"),
				amount: shiftPressed ? item.data("amount") : $(".amount").val()
			};
	
			// Verifica se a chave do item existe antes de prosseguir
			if (itemData.key === undefined) return;
	
			// Converte a quantidade para um inteiro, assumindo que o valor de '.amount' é um número
			itemData.amount = parseInt(itemData.amount, 10);
	
			// Faz a requisição POST com os dados coletados
			$.post("http://inventory/useItem", JSON.stringify({
				slot: itemData.slot,
				amount: itemData.amount
			}));
		}
	});

	if (isDragging) {
		return;
	}

	$(document).on('mousemove', '.populated', function(event) {
	  var tooltipX = event.pageX + 20; // 20 pixels à direita do cursor para evitar sobreposição
	  var tooltipY = event.pageY;

	  $('.details').css({'top': tooltipY, 'left': tooltipX});
	});
  
	$(document).on('mouseenter', '.populated', function() {
		if (!isDragging) {
	  		$(this).find('.details').show();
		}
	});
  
	$(document).on('mouseleave', '.populated', function() {
	  $(this).find('.details').hide();
	});
});

const updateDrag = () => {
	$(".populated").draggable({
		helper: "clone",
		start: function(event, ui) {
			$('.details').hide();
			isDragging = true;
		  },
		  stop: function(event, ui) {
			isDragging = false;
		  }
	});

	$(".empty").droppable({
		hoverClass: "hoverControl",
		drop: function(event,ui){
			if(ui.draggable.parent()[0] == undefined) return;

			const shiftPressed = event.shiftKey;
			const origin = ui.draggable.parent()[0].className;
			if (origin === undefined) return;
			const tInv = $(this).parent()[0].className;

			if(origin === "inventory-sctructureR" && tInv === "inventory-sctructureR") return;
			
			itemData = { key: ui.draggable.data("item-key"), slot: ui.draggable.data("slot") };
			const target = $(this).data("slot");

			if (itemData.key === undefined || target === undefined) return;

			let amount = 0;
			let itemAmount = parseInt(ui.draggable.data("amount"));

			if (shiftPressed)
				amount = itemAmount;
			else if($(".amount").val() == "" | parseInt($(".amount").val()) <= 0)
				amount = 1;
			else
				amount = parseInt($(".amount").val());

			if(amount > itemAmount)
				amount = itemAmount;

			$(".populated, .empty, .use, .send, .deliver").off("draggable droppable");

			let clone1 = ui.draggable.clone();
			let slot2 = $(this).data("slot"); 

			if(amount == itemAmount) {
				let clone2 = $(this).clone();
				let slot1 = ui.draggable.data("slot");

				$(this).replaceWith(clone1);
				ui.draggable.replaceWith(clone2);
				
				$(clone1).data("slot", slot2);
				$(clone2).data("slot", slot1);
			} else {
				let newAmountOldItem = itemAmount - amount;
				let weight = parseFloat(ui.draggable.data("peso"));
				let newWeightClone1 = (amount*weight).toFixed(2);
				let newWeightOldItem = (newAmountOldItem*weight).toFixed(2);

				ui.draggable.data("amount",newAmountOldItem);

				clone1.data("amount",amount);

				$(this).replaceWith(clone1);
				$(clone1).data("slot",slot2);

				ui.draggable.children(".infos").children(".itemAmount").html(formatarNumero(ui.draggable.data("amount")) + "x");
				ui.draggable.children(".infos").children(".itemWeight").html(newWeightOldItem);
				
				$(clone1).children(".infos").children(".itemAmount").html(formatarNumero(clone1.data("amount")) + "x");
				$(clone1).children(".infos").children(".itemWeight").html(newWeightClone1);
			}

			updateDrag();
			acessibilityZoom(currentZoom)
			if (origin === "inventory-sctructureL" && tInv === "inventory-sctructureL" || origin === "hotkeys-list" && tInv === "hotkeys-list" || origin === "inventory-sctructureL" && tInv === "hotkeys-list" || origin === "hotkeys-list" && tInv === "inventory-sctructureL"){

				$.post("http://inventory/updateSlot",JSON.stringify({
					item: itemData.key,
					slot: itemData.slot,
					target: target,
					amount: parseInt(amount)
				}));
			} else if (origin === "inventory-sctructureR" && tInv === "inventory-sctructureL" || origin === "inventory-sctructureR" && tInv === "hotkeys-list"){
				const id = ui.draggable.data("id");
				$.post("http://inventory/pickupItem",JSON.stringify({
					id: id,
					target: target,
					amount: parseInt(amount)
				}));
			} else if (origin === "inventory-sctructureL" && tInv === "inventory-sctructureR" || origin === "hotkeys-list" && tInv === "inventory-sctructureR"){
				$.post("http://inventory/dropItem",JSON.stringify({
					item: itemData.key,
					slot: itemData.slot,
					amount: parseInt(amount)
				}));
			}

			$(".amount").val("");
		}
	});

	$(".populated").droppable({
		hoverClass: "hoverControl",
		drop: function(event,ui){
			if(ui.draggable.parent()[0] == undefined) return;
			const shiftPressed = event.shiftKey;
			const origin = ui.draggable.parent()[0].className;
			if (origin === undefined) return;
			const tInv = $(this).parent()[0].className;
			if(origin === "inventory-sctructureR" && tInv === "inventory-sctructureR") return;

			itemData = { key: ui.draggable.data("item-key"), slot: ui.draggable.data("slot") };
			const target = $(this).data("slot");

			if (itemData.key === undefined || target === undefined) return;

			let amount = 0;
			let itemAmount = parseInt(ui.draggable.data("amount"));
			if (shiftPressed)
				amount = itemAmount;
			else if($(".amount").val() == "" | parseInt($(".amount").val()) <= 0)
				amount = 1;
			else
				amount = parseInt($(".amount").val());

			if(amount > itemAmount)
				amount = itemAmount;

			$(".populated, .empty, .use, .send, .deliver").off("draggable droppable");

			if(ui.draggable.data("item-key") == $(this).data("item-key")){
				let newSlotAmount = amount + parseInt($(this).data("amount"));
				let newSlotWeight = ui.draggable.data("peso") * newSlotAmount;

				$(this).data("amount",newSlotAmount);
				$(this).children(".infos").children(".itemAmount").html(formatarNumero(newSlotAmount) + "x");
				$(this).children(".infos").children(".itemWeight").html(newSlotWeight.toFixed(2));

				if(amount == itemAmount) {
					ui.draggable.replaceWith(` <li class="item empty" data-slot="${ui.draggable.data("slot")}"><div class="slot"></div></li>`);
				} else {
					let newMovedAmount = itemAmount - amount;
					let newMovedWeight = parseFloat(ui.draggable.data("peso")) * newMovedAmount;

					ui.draggable.data("amount",newMovedAmount);
					ui.draggable.children(".infos").children(".itemAmount").html(formatarNumero(newMovedAmount) + "x");
					ui.draggable.children(".infos").children(".itemWeight").html(newMovedWeight.toFixed(2));
				}
			} else {
				if (origin === "inventory-sctructureR" && tInv === "inventory-sctructureL") return;

				let clone1 = ui.draggable.clone();
				let clone2 = $(this).clone();

				let slot1 = ui.draggable.data("slot");
				let slot2 = $(this).data("slot");

				ui.draggable.replaceWith(clone2);
				$(this).replaceWith(clone1);

				$(clone1).data("slot",slot2);
				$(clone2).data("slot",slot1);
			}

			updateDrag();
			acessibilityZoom(currentZoom)

			if (origin === "inventory-sctructureL" && tInv === "inventory-sctructureL" || origin === "hotkeys-list" && tInv === "hotkeys-list" || origin === "inventory-sctructureL" && tInv === "hotkeys-list" || origin === "hotkeys-list" && tInv === "inventory-sctructureL") {
				$.post("http://inventory/updateSlot",JSON.stringify({
					item: itemData.key,
					slot: itemData.slot,
					target: target,
					amount: parseInt(amount)
				}));
			} else if (origin === "inventory-sctructureR" && tInv === "inventory-sctructureL" || origin === "inventory-sctructureR" && tInv === "hotkeys-list"){
				const id = ui.draggable.data("id");
				$.post("http://inventory/pickupItem",JSON.stringify({
					id: id,
					target: target,
					amount: parseInt(amount)
				}));
			} else if (origin === "inventory-sctructureL" && tInv === "inventory-sctructureR" || origin === "hotkeys-list" && tInv === "inventory-sctructureR"){
				$.post("http://inventory/dropItem",JSON.stringify({
					item: itemData.key,
					slot: itemData.slot,
					amount: parseInt(amount)
				}));
			}

			$(".amount").val("");
		}
	});

	$(".use").droppable({
		hoverClass: "hoverControl",
		drop: function(event,ui){
			if(ui.draggable.parent()[0] == undefined) return;

			const shiftPressed = event.shiftKey;
			const origin = ui.draggable.parent()[0].className;
			if (origin === undefined || origin === "inventory-sctructureR") return;
			itemData = { key: ui.draggable.data("item-key"), slot: ui.draggable.data("slot") };

			if (itemData.key === undefined) return;

			let amount = $(".amount").val();
			if (shiftPressed) amount = ui.draggable.data("amount");

			$.post("http://inventory/useItem",JSON.stringify({
				slot: itemData.slot,
				amount: parseInt(amount)
			}));

			$(".amount").val("");
		}
	});

	$(".send").droppable({
		hoverClass: "hoverControl",
		drop: function(event,ui){
			if(ui.draggable.parent()[0] == undefined) return;

			const shiftPressed = event.shiftKey;
			const origin = ui.draggable.parent()[0].className;
			if (origin === undefined || origin === "inventory-sctructureR") return;
			itemData = { key: ui.draggable.data("item-key"), slot: ui.draggable.data("slot") };

			if (itemData.key === undefined) return;

			let amount = $(".amount").val();
			if (shiftPressed) amount = ui.draggable.data("amount");

			$.post("http://inventory/sendItem",JSON.stringify({
				slot: itemData.slot,
				amount: parseInt(amount)
			}));

			$(".amount").val("");
		}
	});

	$(".populated").on("auxclick", e => {
		if (e["which"] === 3){
			const item = e["target"];
			const shiftPressed = event.shiftKey;
			const origin = $(item).parent()[0].className;
			if (origin === undefined || origin === "inventory-sctructureR") return;

			itemData = { key: $(item).data("item-key"), slot: $(item).data("slot") };

			if (itemData.key === undefined) return;

			let amount = $(".amount").val();
			if (shiftPressed) amount = $(item).data("amount");

			$.post("http://inventory/useItem",JSON.stringify({
				slot: itemData.slot,
				amount: parseInt(amount)
			}));
		}
	});
}


const colorPicker = (percent) => {
	var colorPercent = "#ffcd00";

	if (percent >= 100)
		colorPercent = "#'00FF71";

	if (percent >= 51 && percent <= 75)
		colorPercent = "#fcc458";

	if (percent >= 26 && percent <= 50)
		colorPercent = "#fc8a58";

	if (percent <= 25)
		colorPercent = "#fc5858";

	return colorPercent;
}

function handleChangeClothe(clothe){

	const updateClotheList = clothesStatus.map((item) => {
		if (item.name === clothe){
			item.status = !item.status;
		}
		return item;
	});

	clothesStatus = updateClotheList;

	$.post("http://inventory/changeClothes",JSON.stringify(clothe))
	updateClothes();
}

const updateMochila = () => {
	$.post("http://inventory/requestInventory",JSON.stringify({}),(data) => {
		$(".weightBar").html(`<span>${data["invPeso"].toFixed(0) +"</span>/"+ data["invMaxpeso"].toFixed(0)}KG`);
		$(".hotbar ul").html("");
		$(".weight-bars").html("");
		$(".inventory-sctructureL").html("");
		$(".inventory-sctructureR").html("");
		$(".hotkeys-list").html("");
		$(".inventory-hotkeys").html("");

		$('.avatar').attr('src', data["avatar"]);
		$('.namePlayer').html(data["name"]);
		$('.bank').html('$'+data["bank"]);
		$('.phone').html(data["phone"]);

		if (data["invMaxpeso"] > 100)
			data["invMaxpeso"] = 100;

		let maxBars = 10;
		let currentRpm = mapValue(data["invPeso"], 0, data["invMaxpeso"], 0, 10)

		for (let i = 0; i < currentRpm; i++) {
			maxBars -= 1;
			$('.weight-bars').append(`
				<div class="weight-bar active"></div>
			`)
		}

		for (let i = 0; i < maxBars; i++) {
			$('.weight-bars').append(`
				<div class="weight-bar"></div>
			`)
		}

		const nameList2 = data["drop"].sort((a,b) => (a["name"] > b["name"]) ? 1:-1);

		
		for (let x = 1; x <= 5; x++){
			const slot = x.toString();

			if (data["inventario"][slot] !== undefined){
				const v = data["inventario"][slot];

				if(v["img"] === undefined){
					image = `nui://inventory/web-side/images/${v["index"]}.png`
				}else{
					image = v["img"]
				}
				$(".hotbar ul").append(`
					<li><div class="slot"><img src="${image}"/></div></li>
				`)
			}else {
				$(".hotbar ul").append(`
					<li><div class="slot">${x}</div></li>
				`)
			}
		}

		for (let x = 1; x <= 5; x++){
			
			const slot = x.toString();

			if (data["inventario"][slot] !== undefined){
				const v = data["inventario"][slot];
				const maxDurability = 86400 * v["days"];
				const newDurability = (maxDurability - v["durability"]) / maxDurability;
				var actualPercent = parseInt(newDurability * 100);

				if (actualPercent <= 1)
					actualPercent = 1;

				let image = ""

				if(v["img"] === undefined){
					image = `nui://inventory/web-side/images/${v["index"]}.png`
				}else{
					image = v["img"]
				}

					const item = `
					<li class="item lihot populated" data-max="${v["max"]}" data-type="${v["type"]}" data-description="${v["desc"]}" data-amount="${v["amount"]}" data-index="${v["index"]}" data-peso="${v["peso"]}" data-item-key="${v["key"]}" data-name-key="${v["name"]}" data-slot="${slot}">
						<div class="slot">
							<img src="${image}" class="itemImage" alt="">
							<div class="durability-container">
								<div class="durability">
									<div class="durability-progress" style="width: ${actualPercent == 1 ? "100":actualPercent}%; background: ${actualPercent == 1 ? "#fc5858":colorPicker(actualPercent)};"></div>
								</div>
							</div>
						</div>
						<div class="details">
							<div class="header-details">
								<div class="title">
									<h1>${v["name"]}</h1>
									<h4>${formatarNumero(v["amount"])}x</h4>
								</div>

								<div class="weight">
									<h3>${(v["peso"] * v["amount"]).toFixed(2)}</h3>
									<img src="./assets/bagdetails.png" alt="">
								</div>
							</div>

							<p>${v['desc'] === undefined ? '' : v['desc'] } </p>
						</div>
					</li>
					`

				$(".hotkeys-list").append(item);
				
			} else {
				const item = `
				<li class="item lihot empty" data-slot="${slot}"><div class="slot"></div></li>
				`

				$(".hotkeys-list").append(item);
			}
		}

		for (let x = 1; x <= data["invMaxpeso"]; x++){
			if (x > 5) {
				const slot = x.toString();

				if (data["inventario"][slot] !== undefined){
					const v = data["inventario"][slot];
					const maxDurability = 86400 * v["days"];
					const newDurability = (maxDurability - v["durability"]) / maxDurability;
					var actualPercent = parseInt(newDurability * 100);
	
					if (actualPercent <= 1)
						actualPercent = 1;
	
					let image = ""
	
					if(v["img"] === undefined){
						image = `nui://inventory/web-side/images/${v["index"]}.png`
					}else{
						image = v["img"]
					}
	
						const item = `
							<li class="item populated" data-max="${v["max"]}" data-type="${v["type"]}" data-description="${v["desc"]}" data-amount="${v["amount"]}" data-index="${v["index"]}" data-peso="${v["peso"]}" data-item-key="${v["key"]}" data-name-key="${v["name"]}" data-slot="${slot}">
								<div class="slot">
									<img src="${image}" class="itemImage" alt="">
									<div class="durability-container">
										<div class="durability">
											<div class="durability-progress" style="width: ${actualPercent == 1 ? "100":actualPercent}%; background: ${actualPercent == 1 ? "#fc5858":colorPicker(actualPercent)};"></div>
										</div>
									</div>
								</div>
								<div class="details">
									<div class="header-details">
										<div class="title">
											<h1>${v["name"]}</h1>
											<h4>${formatarNumero(v["amount"])}x</h4>
										</div>
	
										<div class="weight">
											<h3>${(v["peso"] * v["amount"]).toFixed(2)}</h3>
											<img src="./assets/bagdetails.png" alt="">
										</div>
									</div>
	
									<p>${v['desc'] === undefined ? '' : v['desc'] } </p>
								</div>
							</li>
						`
	
					$(".inventory-sctructureL").append(item);
					
				} else {
					const item = `
					<li class="item empty" data-slot="${slot}"><div class="slot"></div></li>
					`
	
					$(".inventory-sctructureL").append(item);
				}
			}
		}

		for (let x = 1; x <= maxDropItens; x++){
			const slot = x.toString();

			if (nameList2[x - 1] !== undefined){
				const v = nameList2[x - 1];
				const maxDurability = 86400 * v["days"];
				const newDurability = (maxDurability - v["durability"]) / maxDurability;
				var actualPercent = newDurability * 100;

				if (actualPercent <= 1)
					actualPercent = 1;

				let image = ""

				if(v["img"] === undefined){
					image = `nui://inventory/web-side/images/${v["index"]}.png`
				}else{
					image = v["img"]
				}

				const item = `
				<li class="item populated" data-item-key="${v["key"]}" data-id="${v["id"]}" data-amount="${v["amount"]}" data-index="${v["index"]}" data-peso="${v["peso"]}" data-slot="${slot}">
					<div class="slot">
						<img src="${image}" class="itemImage" alt="">
						<div class="durability-container">
							<div class="durability">
								<div class="durability-progress" style="width: ${actualPercent == 1 ? "100":actualPercent}%; background: ${actualPercent == 1 ? "#fc5858":colorPicker(actualPercent)};"></div>
							</div>
						</div>
					</div>
					<div class="details">
						<div class="header-details">
							<div class="title">
								<h1>${v["name"]}</h1>
								<h4>${formatarNumero(v["amount"])}x</h4>
							</div>

							<div class="weight">
								<h3>${(v["peso"] * v["amount"]).toFixed(2)}</h3>
								<img src="./assets/bagdetails.png" alt="">
							</div>
						</div>

						<p>${v['desc'] === undefined ? '' : v['desc'] } </p>
					</div>
				</li>
				`

				$(".inventory-sctructureR").append(item);
			} else {

				const item = `
				<li class="item empty" data-slot="${slot}">
					<div class="slot"></div>
				</li>
				`

				$(".inventory-sctructureR").append(item);
			}
		}

		updateDrag();
		acessibilityZoom(currentZoom)
	});
}

 /* ----------CRAFT---------- */
 $(document).on("click",".craft",function(e){
	$.post("http://inventory/Craft");
})

const formatarNumero = n => {
	var n = n.toString();
	var r = "";
	var x = 0;

	for (var i = n["length"]; i > 0; i--) {
		r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? "." : "");
		x = x == 2 ? 0 : x + 1;
	}

	return r.split("").reverse().join("");
}   

function mapValue(value, start1, stop1, start2, stop2) {
    if (value < start1) {
      return start2;
    }
    if (value > stop1) {
      return stop2;
    }
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  function acessibilityZoom(stage){
	if(stage === "1"){
		maxDropItens = 8;

		$("li").css("width","5.625rem");
		$("li").css("height","5.625rem");
		$(".lihot").css("margin","0.2rem 0");
		$(".lihot").css("height","5.625rem");
		$(".lihot").css("width","5.625rem;");
		$(".dropList").css("width","18.25rem");
		$(".itensList").css("width","44.125rem");
		$(".itensList ul").css("width","43.125rem");
		$(".itensList ul").css("max-width","43.125rem");
		$('.main-inventory').css('width','90%');
		$('.clothes').css('width','28.75em');
		$('.clothes .main ul').css('width','6rem');
		$(".clotheli").css("width","5.625rem");
		$(".clotheli").css("height","5.625rem");
		$('.hotkeys').width('10rem');
		
	}else if(stage === "2"){
		$("li").css("width","7rem");
		$("li").css("height","7rem");
		$(".lihot").css("margin","0.5rem 0");
		$(".lihot").css("height","5.625rem");
		$(".lihot").css("width","5.625rem");
		$(".dropList").css("width","15rem");
		$(".itensList").css("width","47.2rem");
		$(".itensList ul").css("width","45.25rem");
		$(".itensList ul").css("max-width","45.25rem");
		$('.main-inventory').css('width','95%');
		$('.clothes').css('width','32rem');
		$('.clothes .main ul').css('width','8rem');
		maxDropItens = 8;
	}else if(stage === "3"){
		maxDropItens = 18;
		$("li").css("width","8.4rem");
		$("li").css("height","8.4rem");
		$(".lihot").css("margin","0.5rem 0");
		$(".dropList").css("width","20rem");
		$(".itensList").css("width","47.2rem");
		$(".itensList ul").css("width","45.25rem");
		$(".itensList ul").css("max-width","45.25rem");
		$('.main-inventory').css('width','95%');
		$('.clothes').css('width','32rem');
		$('.clothes .main ul').css('width','8rem');
		$(".clotheli").css("width","6.625rem");
		$(".clotheli").css("height","5.625rem");
		$('.hotkeys').width('13rem');
	}
  }