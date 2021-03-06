/**
 * Created by jbuisine on 09/02/17.
 */


var dataSolutionFile;

$(document).ready(function(){

    checkSolFiles();
    $("#selectSolutionsGenerate").hide();
});


//Get all files of current template type
$( "#albumType" ).change(function() {

    $.ajax({
        type: "POST",
        url: '/load-solutions',
        data: {
            albumType: $("#albumType").val(),
            templateName: $("#templateName").val()
        },
        success: loadSelectSol
    });
});

/**
 * Check if it's necessary to show or hide the modal access button
 */
function checkSolFiles(){
    if($("#solutionFile").children().length > 0 && $("#solutionFile").children().first().text() !== "No solution found"){
        loadSolutions();
    }else{
        $("#solution-information").hide();
        $("#selectSolutionsGenerate").hide();
    }
}

function loadSelectSol(solutions) {

    $( "#solutionFile" ).empty();

    console.log(solutions.length);

    if(solutions.length > 0){
        $("#solutionFile").attr('disabled', false);
        $.each(solutions, function( key, sol ) {
            $("#solutionFile").append('<option value="' + sol + '">' + sol + '</option>');
        });
        loadSolutions();
    }
    else{
        $("#solutionFile").attr('disabled', true);
        $("#solutionFile").append('<option>No solution found</option>');
    }

    checkSolFiles();
}

$("#solutionFile").change(loadSolutions);

$("#solution-information").click(function(){

    console.log('show solution');
    $('#generation-info-modal').modal();
});

function loadSolutions(){

    $("#solution-information").show();
    $('#selectSolutionsGenerate').hide('500');
    $('#generate-solution-btn').hide('200');

    $.ajax({
        type: "POST",
        url: '/load-solution-content',
        data: {
            templateName: $("#templateName").val(),
            albumType: $("#albumType").val(),
            solutionFile: $("#solutionFile").val()
        },
        success: loadContentSol
    });
}

function loadContentSol(data) {

    $('#graphic-representation').empty();

    var head = data[0];
    data.splice(0, 1);

    switch (head.length){

        case 1:
            var content = '<div style="text-align: center;"><h3>' + $('#solutionFile').val() + '</h3></div>';
            content += '<br />';
            content += '<div><b>' + head[0] + ' : </b>' + parseFloat(data[0][1]).toFixed(2) + '</div>';
            $('#graphic-representation').append(content);
            break;

        case 2 :
            generate2DPlot(data, head);
            break;

        case 3 :
            generate3DPlot(data, head);
            break;
    }

    $('#selectSolutionsGenerate').empty();

    dataSolutionFile = data;

    data.forEach(function (element, index) {

       var dataElement = '<option value="' + (index+1) + '">[' + (index+1) + "] ";

       head.forEach(function (h, i) {
           dataElement += h + " : " + parseFloat(element[i+1]).toFixed(2);

           if(i+1 !== head.length){
               dataElement += " - ";
           }
       });
       dataElement += '</option>';

        $('#selectSolutionsGenerate').append(dataElement);
    });

    $('#selectSolutionsGenerate').show('500');
    $('#generate-solution-btn').show('500');
}

/**
 * Utility function used for generate 2D plot
 *
 * @param data
 * @param head
 */
function generate2DPlot(data, head){

    var xAxis = [];
    var yAxis = [];

    data.forEach(function (elem) {
        xAxis.push(elem[1]);
        yAxis.push(elem[2]);
    });

    var line = {
        x: xAxis,
        y: yAxis,
        type: 'scatter',
        mode: 'markers'
    };

    var layout = {
        title: $('#solutionFile').val(),
        xaxis: {
            title: head[0],
            type: 'log',
            autorange: true,
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
        yaxis: {
            title: head[1],
            type: 'log',
            autorange: true,
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        }
    };

    Plotly.newPlot('graphic-representation', [line], layout);
}

/**
 *  Utility function used for generate 3D plot
 *
 * @param data
 * @param head
 */
function generate3DPlot(data, head){

    var xAxis = [];
    var yAxis = [];
    var zAxis = [];

    data.forEach(function (elem) {
        xAxis.push(elem[1]);
        yAxis.push(elem[2]);
        zAxis.push(elem[3]);
    });

    var line1 = {
        type: 'scatter3d',
        mode: 'markers',
        x: xAxis,
        y: yAxis,
        z: zAxis,
        marker: {
            color: 'rgb(23, 190, 207)',
            size: 2
        }
    };

    var layout = {
        aspectratio: {
            x: 1,
            y: 1,
            z: 1
        },
        camera: {
            center: {
                x: 0,
                y: 0,
                z: 0
            },
            eye: {
                x: 1,
                y: 1,
                z: 1
            },
            up: {
                x: 0,
                y: 0,
                z: 1
            }
        },
        scene: {
            xaxis: {
                title: head[0]
            },
            yaxis: {
                title: head[1]
            },
            zaxis: {
                title: head[2]
            }
        },
        height: 550,
        autosize: true,
        title: $('#solutionFile').val()
    };

    Plotly.newPlot('graphic-representation', [line1], layout);
}